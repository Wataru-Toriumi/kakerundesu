use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use std::{
    fs::{self, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    sync::Mutex,
};
use tauri::Emitter;

struct FolderWatcher(Mutex<Option<RecommendedWatcher>>);

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
struct LibraryListing {
    files: Vec<MarkdownFile>,
    folders: Vec<LibraryFolder>,
}

fn is_markdown(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| {
            matches!(
                extension.to_ascii_lowercase().as_str(),
                "md" | "markdown" | "mdx"
            )
        })
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
fn list_markdown_files(folder: String) -> Result<LibraryListing, String> {
    let root = PathBuf::from(folder);
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

#[tauri::command]
fn read_markdown_file(path: String) -> Result<String, String> {
    let path = PathBuf::from(path);
    if !is_markdown(&path) {
        return Err("Markdownファイルではありません".into());
    }
    fs::read_to_string(path).map_err(|error| error.to_string())
}

#[tauri::command]
fn write_markdown_file(path: String, content: String) -> Result<(), String> {
    let path = PathBuf::from(path);
    if !is_markdown(&path) {
        return Err("Markdownファイルではありません".into());
    }
    fs::write(path, content).map_err(|error| error.to_string())
}

#[tauri::command]
fn create_markdown_file(
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

#[tauri::command]
fn create_folder(root: String, relative_parent: String, folder_name: String) -> Result<(), String> {
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

#[tauri::command]
fn watch_markdown_folder(
    app: tauri::AppHandle,
    watcher_state: tauri::State<'_, FolderWatcher>,
    folder: String,
) -> Result<(), String> {
    let folder = PathBuf::from(folder);
    if !folder.is_dir() {
        return Err("監視するフォルダが見つかりません".into());
    }

    let app_handle = app.clone();
    let mut watcher = notify::recommended_watcher(move |result: notify::Result<notify::Event>| {
        if let Ok(event) = result {
            let includes_markdown = event.paths.iter().any(|path| {
                is_markdown(path) || path.extension().is_none() || event.kind.is_remove()
            });
            if includes_markdown {
                let _ = app_handle.emit("library-changed", ());
            }
        }
    })
    .map_err(|error| error.to_string())?;

    watcher
        .watch(&folder, RecursiveMode::Recursive)
        .map_err(|error| error.to_string())?;

    *watcher_state.0.lock().map_err(|error| error.to_string())? = Some(watcher);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(FolderWatcher(Mutex::new(None)))
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            list_markdown_files,
            read_markdown_file,
            write_markdown_file,
            create_markdown_file,
            create_folder,
            watch_markdown_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running the application");
}
