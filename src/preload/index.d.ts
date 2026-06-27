import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectFolder: () => Promise<string | null>

      scanMusicFolder: (folderPath: string) => Promise<any[]>

      saveMetadata: (data: {
        path: string
        title: string
        artist: string
        album: string
      }) => Promise<boolean>
    }
  }
}
