use tauri::{
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem, Submenu},
    AppHandle, Emitter, Manager,
};

const OPEN_SETTINGS: &str = "open-settings";
const OPEN_DOCUMENT: &str = "open-document";

pub fn build(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let menu = Menu::default(app)?;
    // On macOS the first submenu is the application menu.
    #[cfg(target_os = "macos")]
    if let Some(app_menu) = menu.items()?.first().and_then(|item| item.as_submenu()) {
        let settings = MenuItem::with_id(app, OPEN_SETTINGS, "設定…", true, Some("Cmd+Comma"))?;
        app_menu.insert_items(&[&settings, &PredefinedMenuItem::separator(app)?], 2)?;
    }

    let open = MenuItem::with_id(
        app,
        OPEN_DOCUMENT,
        "ファイルを開く…",
        true,
        Some("CmdOrCtrl+O"),
    )?;
    for item in menu.items()? {
        if let Some(submenu) = item.as_submenu() {
            if submenu.text()? == "File" {
                submenu.set_text("ファイル")?;
                submenu.insert_items(&[&open, &PredefinedMenuItem::separator(app)?], 0)?;
                return Ok(menu);
            }
        }
    }
    menu.prepend(&Submenu::with_items(app, "ファイル", true, &[&open])?)?;
    Ok(menu)
}

pub fn handle(app: &AppHandle, event: MenuEvent) {
    let action = event.id().as_ref();
    if !matches!(action, OPEN_SETTINGS | OPEN_DOCUMENT) {
        return;
    }
    if let Some(window) = app.get_webview_window("main") {
        if let Err(error) = window
            .unminimize()
            .and_then(|_| window.set_focus())
            .and_then(|_| window.emit("app-menu", action))
        {
            eprintln!("メニュー操作に失敗しました: {error}");
        }
    }
}
