use tauri::{
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem},
    AppHandle, Emitter, Manager,
};

const OPEN_SETTINGS: &str = "open-settings";

pub fn build(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let menu = Menu::default(app)?;
    // On macOS the first submenu is the application menu.
    if let Some(app_menu) = menu.items()?.first().and_then(|item| item.as_submenu()) {
        let settings = MenuItem::with_id(app, OPEN_SETTINGS, "設定…", true, Some("Cmd+Comma"))?;
        app_menu.insert_items(&[&settings, &PredefinedMenuItem::separator(app)?], 2)?;
    }
    Ok(menu)
}

pub fn handle(app: &AppHandle, event: MenuEvent) {
    if event.id().as_ref() == OPEN_SETTINGS {
        if let Some(window) = app.get_webview_window("main") {
            if let Err(error) = window
                .unminimize()
                .and_then(|_| window.set_focus())
                .and_then(|_| window.emit(OPEN_SETTINGS, ()))
            {
                eprintln!("設定を開けませんでした: {error}");
            }
        }
    }
}
