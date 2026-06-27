import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { readdir } from 'fs/promises'
import { extname, join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { parseFile } from 'music-metadata'
import { MusicFile } from 'music-tag-native'

const SUPPORTED_EXTENSIONS = [
  '.mp3',
  '.flac',
  '.wav',
  '.m4a',
  '.aac',
  '.ogg'
]

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.dhvani.desktop')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('dialog:selectFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (result.canceled) {
      return null
    }

    return result.filePaths[0]
  })

  ipcMain.handle('library:scanMusicFolder', async (_, folderPath: string) => {
    const entries = await readdir(folderPath)

    const musicFiles = entries
      .filter((file) =>
        SUPPORTED_EXTENSIONS.includes(extname(file).toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b))

    const tracks = await Promise.all(
      musicFiles.map(async (file) => {
        const fullPath = join(folderPath, file)
        const metadata = await parseFile(fullPath)

        return {
          name: file,
          path: fullPath,
          extension: extname(file).toLowerCase(),

          title: metadata.common.title,
          artist: metadata.common.artist,
          album: metadata.common.album,
          duration: metadata.format.duration
        }
      })
    )

    return tracks
  })

  ipcMain.handle(
    'library:saveMetadata',
    async (
      _,
      data: {
        path: string
        title: string
        artist: string
        album: string
      }
    ) => {
      const musicFile = await MusicFile.load(data.path)

      musicFile.title = data.title
      musicFile.artist = data.artist
      musicFile.album = data.album

      await musicFile.save()

      return true
    }
  )
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})