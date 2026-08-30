use super::is_markdown;
use serde::Serialize;
use std::{fs, path::Path};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct MarkdownFile {
    name: String,
    path: String,
    relative_path: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct LibraryFolder {
    relative_path: String,
}

#[derive(Serialize)]
pub(crate) struct LibraryListing {
    files: Vec<MarkdownFile>,
    folders: Vec<LibraryFolder>,
}

fn collect_markdown_files(
    root: &Path,
    directory: &Path,
    files: &mut Vec<MarkdownFile>,
    folders: &mut Vec<LibraryFolder>,
) -> Result<(), String> {
    let entries = fs::read_dir(directory).map_err(|error| error.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|error| error.to_string())?;
        let file_type = entry.file_type().map_err(|error| error.to_string())?;
        let path = entry.path();
        if file_type.is_dir() {
            let directory_name = entry.file_name();
            let directory_name = directory_name.to_string_lossy();
            if !directory_name.starts_with('.')
                && !matches!(directory_name.as_ref(), "node_modules" | "target")
            {
                let relative_path = path.strip_prefix(root).unwrap_or(&path);
                folders.push(LibraryFolder {
                    relative_path: relative_path.to_string_lossy().into_owned(),
                });
                let _ = collect_markdown_files(root, &path, files, folders);
            }
        } else if file_type.is_file() && is_markdown(&path) {
            let relative_path = path.strip_prefix(root).unwrap_or(&path);
            files.push(MarkdownFile {
                name: entry.file_name().to_string_lossy().into_owned(),
                path: path.to_string_lossy().into_owned(),
                relative_path: relative_path.to_string_lossy().into_owned(),
            });
        }
    }
    Ok(())
}

#[tauri::command]
pub(crate) fn list_markdown_files(folder: String) -> Result<LibraryListing, String> {
    let root = std::path::PathBuf::from(folder);
    if !root.is_dir() {
        return Err("設定されたフォルダが見つかりません".into());
    }

    let mut files = Vec::new();
    let mut folders = Vec::new();
    collect_markdown_files(&root, &root, &mut files, &mut folders)?;
    files.sort_by_key(|file| file.relative_path.to_ascii_lowercase());
    folders.sort_by_key(|folder| folder.relative_path.to_ascii_lowercase());
    Ok(LibraryListing { files, folders })
}
