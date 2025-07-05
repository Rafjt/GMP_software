// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  decryptPassword: async (cipherText) => {
    return await ipcRenderer.invoke('decrypt-password', cipherText);
  },
  setCryptoKey: async (password, saltBase64) => {
    return await ipcRenderer.invoke('set-crypto-key', password, saltBase64);
  },
  encryptPassword: async (plaintext) => {
    return await ipcRenderer.invoke('encrypt-password', plaintext);
  },
  generateQrCode: async (url) => {
    return await ipcRenderer.invoke('generate-qrcode', url);
  }
});
