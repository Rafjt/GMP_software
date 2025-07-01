const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { ipcMain } = require('electron');
const bcrypt = require('bcryptjs');

ipcMain.handle('hash-password', async (event, password) => {
  return await bcrypt.hash(password, 10);
});

ipcMain.handle('set-crypto-key', async (_event, password, saltBase64) => {
  try {
    cachedKey = await deriveKey(password, saltBase64);
    return { success: true };
  } catch (err) {
    console.error("Key derivation failed:", err);
    return { error: "Key derivation failed." };
  }
});

ipcMain.handle('decrypt-password', async (_event, cipherText) => {
  if (!cachedKey) {
    return { error: "Key is missing." };
  }

  try {
    const combined = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cachedKey, data);
    const text = new TextDecoder().decode(decrypted);
    return { plainText: text };
  } catch (err) {
    console.error("Decryption failed:", err);
    return { error: "Decryption failed." };
  }
});

let cachedKey = null;

async function deriveKey(password, saltBase64) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return key;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'data', 'RRPMLock.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.setMenu(null);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
