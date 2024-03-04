const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('degreeRequirements', {
    load: () => ipcRenderer.invoke('degreeRequirements'),
})
