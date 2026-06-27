import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectFolder: () => Promise<string | null>
      scanMusicFolder: (folderPath: string) => Promise<string[]>
    }
  }
}
