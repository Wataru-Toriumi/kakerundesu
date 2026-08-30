mod files;
mod folders;
mod listing;

use std::path::Path;

pub(crate) use files::{create_markdown_file, read_markdown_file, write_markdown_file};
pub(crate) use folders::create_folder;
pub(crate) use listing::list_markdown_files;

pub(crate) fn is_markdown(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| {
            matches!(
                extension.to_ascii_lowercase().as_str(),
                "md" | "markdown" | "mdx"
            )
        })
}
