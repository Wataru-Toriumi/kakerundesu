use crate::markdown_library::is_markdown;
use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use std::{path::PathBuf, sync::Mutex};
use tauri::Emitter;

#[derive(Default)]
pub(crate) struct FolderWatcher(Mutex<Option<RecommendedWatcher>>);

#[tauri::command]
pub(crate) fn watch_markdown_folder(
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
