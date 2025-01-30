import { app, BrowserWindow , ipcMain, dialog} from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fs = require('fs'); // Importez fs ici

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    // remove the default titlebar
    titleBarStyle: "hidden",
    // expose window controlls in Windows/Linux
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    titleBarOverlay: {
      color: "#F9F9FA",
      symbolColor: "#282c34",
      height: 30,
    },
    minWidth:800,
    minHeight:600,
    width:1300,
    height:820,
  });
  win.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      win?.webContents.toggleDevTools();
    }
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);


// save as
ipcMain.handle('dialog:saveAs', async (event, defaultFileName) => {
  const result = await dialog.showSaveDialog(win, {
      title: 'Save As',
      defaultPath: defaultFileName, // Utilisez le nom de fichier par défaut reçu
      buttonLabel: 'Save',
      filters: [
          { name: 'Text Files', extensions: ['txt', 'md'] }, // Ajoutez d'autres types de fichiers si nécessaire
          { name: 'All Files', extensions: ['*'] }
      ]
  });
  return result.filePath;
});
ipcMain.handle('file:save', async (event, { filePath, content }) => {
  fs.writeFileSync(filePath, content);
  return { success: true };
});
// open
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [
          { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
          { name: 'All Files', extensions: ['*'] }
      ]
  });
  
  if (result.canceled) {
      return null;
  } else {
      return result.filePaths[0]; // Renvoie le chemin du fichier sélectionné
  }
});

ipcMain.handle('file:read', async (event, filePath) => {
  // Lire le contenu du fichier
  return fs.readFileSync(filePath, 'utf-8'); // Assurez-vous d'importer le module fs
});

// exit
ipcMain.on('app:quit', () => {
  app.quit(); // Quitter l'application
});
