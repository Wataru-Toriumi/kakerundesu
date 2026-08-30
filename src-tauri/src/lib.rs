mod folder_watcher;
mod markdown_library;

use folder_watcher::{watch_markdown_folder, FolderWatcher};
use markdown_library::{
    create_folder, create_markdown_file, list_markdown_files, read_markdown_file,
    write_markdown_file,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(FolderWatcher::default())
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
