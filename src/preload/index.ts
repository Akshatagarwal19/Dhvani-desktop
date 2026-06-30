import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pathToFileURL } from 'node:url'

// Custom APIs for renderer
const api = {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),

  scanMusicFolder: (folderPath: string) =>
    ipcRenderer.invoke('library:scanMusicFolder', folderPath),

  saveMetadata: (data: {
    path: string
    title: string
    artist: string
    album: string
  }) => ipcRenderer.invoke('library:saveMetadata', data),
  moveToTrash: (filePath: string) =>
  ipcRenderer.invoke('library:moveToTrash', filePath),

  readAudioFile: (filePath: string) =>
  ipcRenderer.invoke('player:readAudioFile', filePath),

  getAudioUrl: (filePath: string) => pathToFileURL(filePath).href
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
