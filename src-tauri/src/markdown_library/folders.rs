use std::{fs, path::PathBuf};

#[tauri::command]
pub(crate) fn create_folder(
    root: String,
    relative_parent: String,
    folder_name: String,
) -> Result<(), String> {
    let root = PathBuf::from(root)
        .canonicalize()
        .map_err(|error| error.to_string())?;
    let parent = root
        .join(relative_parent)
        .canonicalize()
        .map_err(|error| error.to_string())?;
    if !parent.is_dir() || !parent.starts_with(&root) {
        return Err("選択したフォルダには作成できません".into());
    }

    let folder_name = folder_name.trim();
    if folder_name.is_empty()
        || folder_name == "."
        || folder_name == ".."
        || folder_name.contains('/')
        || folder_name.contains('\\')
    {
        return Err("使用できないフォルダ名です".into());
    }

    fs::create_dir(parent.join(folder_name)).map_err(|error| {
        if error.kind() == std::io::ErrorKind::AlreadyExists {
            "同じ名前のフォルダが既にあります".into()
        } else {
            error.to_string()
        }
    })
}
