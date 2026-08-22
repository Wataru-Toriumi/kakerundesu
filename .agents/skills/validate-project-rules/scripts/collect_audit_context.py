#!/usr/bin/env python3
"""Collect changed files and repository rule documents for a rules audit."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from collections import deque
from pathlib import Path


MARKDOWN_LINK = re.compile(r"\[[^\]]+\]\(([^)]+\.md)(?:#[^)]+)?\)")
BACKTICK_MARKDOWN = re.compile(r"`([^`\n]+\.md)(?:#[^`\n]+)?`")


def run_git(root: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=root,
        check=check,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def git_root() -> Path:
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return Path(result.stdout.strip()).resolve()


def lines(result: subprocess.CompletedProcess[str]) -> list[str]:
    return [line for line in result.stdout.splitlines() if line]


def existing_ref(root: Path, *candidates: str) -> str | None:
    for candidate in candidates:
        result = run_git(root, "rev-parse", "--verify", "--quiet", candidate, check=False)
        if result.returncode == 0:
            return candidate
    return None


def worktree_files(root: Path, staged_only: bool) -> list[str]:
    staged = lines(run_git(root, "diff", "--cached", "--name-only"))
    if staged_only:
        return sorted(set(staged))

    unstaged = lines(run_git(root, "diff", "--name-only"))
    untracked = lines(run_git(root, "ls-files", "--others", "--exclude-standard"))
    return sorted(set(staged + unstaged + untracked))


def branch_files(root: Path, base: str) -> list[str]:
    committed = lines(
        run_git(root, "diff", "--name-only", f"{base}...HEAD")
    )
    return sorted(set(committed + worktree_files(root, staged_only=False)))


def normalize_paths(root: Path, paths: list[str]) -> list[str]:
    normalized: list[str] = []
    for raw_path in paths:
        candidate = (root / raw_path).resolve()
        try:
            relative = candidate.relative_to(root)
        except ValueError as error:
            raise ValueError(f"Path is outside the repository: {raw_path}") from error
        normalized.append(relative.as_posix())
    return sorted(set(normalized))


def agent_documents(root: Path, changed_files: list[str]) -> list[Path]:
    documents: set[Path] = set()
    for relative in changed_files:
        current = (root / relative).parent
        while current == root or root in current.parents:
            override = current / "AGENTS.override.md"
            regular = current / "AGENTS.md"
            if override.is_file():
                documents.add(override)
            elif regular.is_file():
                documents.add(regular)
            if current == root:
                break
            current = current.parent

    if not changed_files:
        for name in ("AGENTS.override.md", "AGENTS.md"):
            candidate = root / name
            if candidate.is_file():
                documents.add(candidate)
                break
    return sorted(documents)


def referenced_markdown(document: Path, root: Path) -> list[Path]:
    content = document.read_text(encoding="utf-8")
    references = MARKDOWN_LINK.findall(content) + BACKTICK_MARKDOWN.findall(content)
    resolved: list[Path] = []
    for raw_reference in references:
        reference = raw_reference.strip().split(maxsplit=1)[0]
        if "://" in reference or reference.startswith("#"):
            continue
        base = root if reference.startswith((".agents/", "/")) else document.parent
        candidate = (base / reference.lstrip("/")).resolve()
        try:
            candidate.relative_to(root)
        except ValueError:
            continue
        resolved.append(candidate)
    return resolved


def discover_rule_documents(
    root: Path, entry_documents: list[Path]
) -> tuple[list[Path], list[Path]]:
    queue = deque(entry_documents)
    visited: set[Path] = set()
    missing: set[Path] = set()

    while queue:
        document = queue.popleft()
        if document in visited:
            continue
        if not document.is_file():
            missing.add(document)
            continue
        visited.add(document)
        for reference in referenced_markdown(document, root):
            if reference not in visited:
                queue.append(reference)
    return sorted(visited), sorted(missing)


def diff_check(root: Path, base: str | None, staged_only: bool) -> list[tuple[str, bool, str]]:
    checks: list[tuple[str, list[str]]] = []
    if base:
        checks.append((f"git diff --check {base}...HEAD", ["diff", "--check", f"{base}...HEAD"]))
    if staged_only:
        checks.append(("git diff --cached --check", ["diff", "--cached", "--check"]))
    else:
        checks.extend(
            [
                ("git diff --check", ["diff", "--check"]),
                ("git diff --cached --check", ["diff", "--cached", "--check"]),
            ]
        )

    results: list[tuple[str, bool, str]] = []
    for label, arguments in checks:
        result = run_git(root, *arguments, check=False)
        output = (result.stdout + result.stderr).strip()
        results.append((label, result.returncode == 0, output))
    return results


def relative_display(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Collect the context needed to audit changes against repository rules."
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--base", help="Compare HEAD and worktree changes against this ref.")
    group.add_argument("--staged", action="store_true", help="Audit staged changes only.")
    parser.add_argument("paths", nargs="*", help="Audit these repository-relative paths.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        root = git_root()
        base = args.base
        if args.paths:
            changed_files = normalize_paths(root, args.paths)
        elif args.staged:
            changed_files = worktree_files(root, staged_only=True)
        elif base:
            changed_files = branch_files(root, base)
        else:
            changed_files = worktree_files(root, staged_only=False)
            if not changed_files:
                base = existing_ref(root, "origin/main", "main")
                changed_files = branch_files(root, base) if base else []
    except (subprocess.CalledProcessError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2

    entry_documents = agent_documents(root, changed_files)
    rule_documents, missing_documents = discover_rule_documents(root, entry_documents)

    print(f"Repository: {root}")
    scope = "explicit paths" if args.paths else ("staged" if args.staged else (base or "worktree"))
    print(f"Scope: {scope}")
    print("\nChanged files:")
    if changed_files:
        for path in changed_files:
            print(f"- {path}")
    else:
        print("- (none)")

    print("\nRule documents:")
    if rule_documents:
        for document in rule_documents:
            print(f"- {relative_display(document, root)}")
    else:
        print("- (none found)")

    print("\nMissing rule references:")
    if missing_documents:
        for document in missing_documents:
            print(f"- {relative_display(document, root)}")
    else:
        print("- (none)")

    print("\nWhitespace checks:")
    failed = False
    for label, passed, output in diff_check(root, base, args.staged):
        print(f"- {'PASS' if passed else 'FAIL'}: {label}")
        if output:
            for line in output.splitlines():
                print(f"  {line}")
        failed = failed or not passed

    if not rule_documents:
        print("\nwarning: No applicable AGENTS.md or AGENTS.override.md was found.", file=sys.stderr)
    return 1 if failed or missing_documents else 0


if __name__ == "__main__":
    raise SystemExit(main())
