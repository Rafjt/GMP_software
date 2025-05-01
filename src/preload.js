// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');
const bcrypt = require('bcryptjs');

// Expose bcrypt to renderer safely
contextBridge.exposeInMainWorld('electronAPI', {
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  }
});