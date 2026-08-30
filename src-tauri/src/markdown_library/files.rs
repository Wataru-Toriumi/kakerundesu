use super::is_markdown;
use std::{
    fs::{self, OpenOptions},
    io::Write,
    path::PathBuf,
};

#[tauri::command]
pub(crate) fn read_markdown_file(path: String) -> Result<String, String> {
    let path = PathBuf::from(path);
    if !is_markdown(&path) {
        return Err("Markdownファイルではありません".into());
    }
    fs::read_to_string(path).map_err(|error| error.to_string())
}

#[tauri::command]
pub(crate) fn write_markdown_file(path: String, content: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    if !is_markdown(&path) {
        return Err("Markdownファイルではありません".into());
    }
    fs::write(path, content).map_err(|error| error.to_string())
}

#[tauri::command]
pub(crate) fn create_markdown_file(
    root: String,
    relative_folder: String,
    file_name: String,
) -> Result<String, String> {
    let root = PathBuf::from(root)
        .canonicalize()
        .map_err(|error| error.to_string())?;
    let folder = root
        .join(relative_folder)
        .canonicalize()
        .map_err(|error| error.to_string())?;
    if !folder.is_dir() || !folder.starts_with(&root) {
        return Err("選択したフォルダには作成できません".into());
    }

    let file_name = file_name.trim();
    if file_name.is_empty()
        || file_name == "."
        || file_name == ".."
        || file_name.contains('/')
        || file_name.contains('\\')
    {
        return Err("使用できないファイル名です".into());
    }

    let mut destination = folder.join(file_name);
    if destination.extension().is_none() {
        destination.set_extension("md");
    }
    if !is_markdown(&destination) {
        return Err("拡張子は .md、.markdown、.mdx のいずれかにしてください".into());
    }

    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&destination)
        .map_err(|error| {
            if error.kind() == std::io::ErrorKind::AlreadyExists {
                "同じ名前のファイルが既にあります".into()
            } else {
                error.to_string()
            }
        })?;
    file.write_all(b"").map_err(|error| error.to_string())?;
    Ok(destination.to_string_lossy().into_owned())
}
