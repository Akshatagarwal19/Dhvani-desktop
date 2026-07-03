import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Track } from '../types/Track'

type LibraryContextType = {
  tracks: Track[]
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>

  selectedFolder: string | null
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>

  duplicates: Track[][]
  setDuplicates: React.Dispatch<React.SetStateAction<Track[][]>>

  loadLibrary: (folder: string) => Promise<void>
  refreshLibrary: () => Promise<void>
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [duplicates, setDuplicates] = useState<Track[][]>([])

  async function loadLibrary(folder: string) {
    const scannedTracks = await window.api.scanMusicFolder(folder)

    setTracks(scannedTracks)
  }
  async function refreshLibrary() {
    if (!selectedFolder) return

    await loadLibrary(selectedFolder)
  }

  return (
    <LibraryContext.Provider
      value={{
        tracks,
        setTracks,

        selectedFolder,
        setSelectedFolder,

        duplicates,
        setDuplicates,

        loadLibrary,
        refreshLibrary
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}

export function useLibrary() {
  const context = useContext(LibraryContext)

  if (!context) {
    throw new Error('useLibrary must be used inside LibraryProvider')
  }

  return context
}
