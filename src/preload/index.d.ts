import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectFolder: () => Promise<string | null>
      scanMusicFolder: (folderPath: string) => Promise<
        {
          name: string
          path: string
          extension: string
          title?: string
          artist?: string
          album?: string
          duration?: number
        }[]
      >
    }
  }
}
