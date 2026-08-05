import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Track } from '../types/Track'
import type { SortOption } from '../types/SortOption'
import type { FilterOption } from '../types/FilterOption'
import { findDuplicates } from '../utils/findDuplicates'

type LibraryContextType = {
  tracks: Track[]
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>

  selectedFolder: string | null
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>

  duplicates: Track[][]
  setDuplicates: React.Dispatch<React.SetStateAction<Track[][]>>

  loadLibrary: (folder: string) => Promise<void>
  refreshLibrary: () => Promise<void>

  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>

  sortOption: SortOption
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>

  activeFilter: FilterOption
  setActiveFilter: React.Dispatch<React.SetStateAction<FilterOption>>
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [duplicates, setDuplicates] = useState<Track[][]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const [sortOption, setSortOption] = useState<SortOption>('title')

  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')

  async function loadLibrary(folder: string) {
    const scannedTracks = await window.api.scanMusicFolder(folder)
    // console.log(scannedTracks)
    console.table(
  scannedTracks
    .filter(track =>
      track.name.includes("A.R Rahman Maahi Ve Full Song")
    )
    .map(track => ({
      name: track.name,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      bitrate: track.bitrate,
      size: track.size,
      path: track.path
    }))
)

    setTracks(scannedTracks)

    setDuplicates(findDuplicates(scannedTracks))
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
        refreshLibrary,
        searchQuery,
        setSearchQuery,
        sortOption,
        setSortOption,
        activeFilter,
        setActiveFilter
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
