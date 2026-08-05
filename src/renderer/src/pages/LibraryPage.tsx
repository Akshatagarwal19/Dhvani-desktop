import { useEffect, useState } from 'react'
import type { Track } from '../types/Track.ts'
import { useLibrary } from '../context/LibraryContext'
import { searchTracks } from '../utils/searchTracks'
import { sortTracks } from '../utils/sortTracks'
import type { SortOption } from '../types/SortOption.ts'
import { filterTracks } from '../utils/filterTracks'
import type { FilterOption } from '../types/FilterOption'
import { calculateLibraryStats, formatDuration } from '../utils/calculateLibraryStats'
import { FileMusic, PenSquare, Search } from 'lucide-react'

function LibraryPage() {
  const {
    tracks,
    selectedFolder,
    setSelectedFolder,
    loadLibrary,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    duplicates,
    activeFilter,
    setActiveFilter
  } = useLibrary()
  const stats = calculateLibraryStats(tracks, duplicates)

  // console.log('Tracks:', tracks.length)

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedArtist, setEditedArtist] = useState('')
  const [editedAlbum, setEditedAlbum] = useState('')
  const [audio] = useState(new Audio())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const searchedTracks = searchTracks(tracks, searchQuery)
  const sortedTracks = sortTracks(searchedTracks, sortOption)
  const displayedTracks = filterTracks(sortedTracks, activeFilter, duplicates)
  const [isEditingMetadata, setIsEditingMetadata] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)

  useEffect(() => {
    audio.onloadedmetadata = () => {
      setDuration(audio.duration)
    }

    audio.ontimeupdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime)
      }
    }

    audio.onended = async () => {
      // console.log('Song ended')
      // console.log(currentTrack)
      setCurrentTime(0)

      await playNextTrack()
    }
    audio.onloadedmetadata = () => {
      // console.log(audio.duration)
      setDuration(audio.duration)
    }

    return () => {
      audio.onloadedmetadata = null
      audio.ontimeupdate = null
      audio.onended = null
    }
  }, [audio, currentTrack, displayedTracks])

  async function handleSelectFolder() {
    const folder = await window.api.selectFolder()

    if (!folder) return

    setSelectedFolder(folder)

    await loadLibrary(folder)
  }
  async function handleSaveMetadata() {
    if (!selectedTrack) return

    const success = await window.api.saveMetadata({
      path: selectedTrack.path,
      title: editedTitle,
      artist: editedArtist,
      album: editedAlbum
    })

    if (success) {
      alert('Metadata saved successfully!')

      setIsEditingMetadata(false)

      if (selectedFolder) {
        await loadLibrary(selectedFolder)
      }
    }
  }
  async function handlePlayPause() {
    if (!selectedTrack) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    if (currentTrack && currentTrack.path === selectedTrack.path) {
      await audio.play()
      setIsPlaying(true)
      return
    }

    await playTrack(selectedTrack)

    await playTrack(selectedTrack)
  }
  function handleStopTrack() {
    audio.pause()

    audio.currentTime = 0

    if (audio.src.startsWith('blob:')) {
      URL.revokeObjectURL(audio.src)
    }

    audio.src = ''

    setIsPlaying(false)
  }
  async function playTrack(track: Track) {
    try {
      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src)
      }

      const bytes = await window.api.readAudioFile(track.path)

      const arrayBuffer = new ArrayBuffer(bytes.byteLength)
      new Uint8Array(arrayBuffer).set(bytes)

      const blob = new Blob([arrayBuffer], {
        type: 'audio/mpeg'
      })

      const url = URL.createObjectURL(blob)

      audio.src = url
      audio.load()
      audio.volume = volume

      await audio.play()
      setCurrentTrack(track)

      setSelectedTrack(track)
      setEditedTitle(track.title || '')
      setEditedArtist(track.artist || '')
      setEditedAlbum(track.album || '')

      setIsPlaying(true)
    } catch (error) {
      console.error(error)
    }
  }
  async function playNextTrack() {
    if (!selectedTrack) return

    const currentIndex = displayedTracks.findIndex((track) => track.path === selectedTrack.path)

    if (currentIndex === -1) return

    const nextTrack = displayedTracks[currentIndex + 1]

    if (!nextTrack) {
      // End of playlist
      handleStopTrack()
      return
    }
    // console.log('Current:', selectedTrack?.name)
    await playTrack(nextTrack)
  }
  async function handleNextTrack() {
    await playNextTrack()
  }
  async function handlePreviousTrack() {
    if (!selectedTrack) return

    const currentIndex = displayedTracks.findIndex((track) => track.path === selectedTrack.path)

    if (currentIndex <= 0) return

    const previousTrack = displayedTracks[currentIndex - 1]

    await playTrack(previousTrack)
  }
  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="library-page">
      <h1>Library</h1>
      <div className="library-actions">
        <div className="library-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="library-controls">
          <select
            aria-label="Sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="title">Sort: Title</option>
            <option value="artist">Sort: Artist</option>
            <option value="album">Sort: Album</option>
            <option value="duration">Sort: Duration</option>
          </select>

          <select
            aria-label="Filter"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as FilterOption)}
          >
            <option value="all">All Tracks</option>
            <option value="missing-title">Missing Title</option>
            <option value="missing-artist">Missing Artist</option>
            <option value="missing-album">Missing Album</option>
            <option value="duplicates">Duplicate Candidates</option>
          </select>

          <button onClick={handleSelectFolder}>Select Music Folder</button>
        </div>
      </div>

      {selectedFolder ? (
        <div className="selected-folder">
          <h3>Selected Library</h3>

          <p className="selected-folder-name">{selectedFolder.split('\\').pop()}</p>

          <p className="selected-folder-path">{selectedFolder}</p>

          <p className="selected-folder-info">
            {stats.totalTracks} Tracks • {formatDuration(stats.totalDuration)}
          </p>
        </div>
      ) : (
        <p>No music folder selected.</p>
      )}

      <div className="library-content">
        {/* ===================== TRACK LIST ===================== */}

        <div className="track-list">
          <h2>Library ({displayedTracks.length} Tracks)</h2>

          {tracks.length === 0 ? (
            <p>No supported audio files found.</p>
          ) : (
            <ul>
              {displayedTracks.map((track) => (
                <li
                  key={track.path}
                  className={selectedTrack?.path === track.path ? 'selected-track' : ''}
                  onClick={() => {
                    audio.pause()
                    audio.currentTime = 0
                    setIsPlaying(false)

                    setSelectedTrack(track)

                    setEditedTitle(track.title || track.name)
                    setEditedArtist(track.artist || '')
                    setEditedAlbum(track.album || '')
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>{track.title || track.name}</strong>
                  <br />
                  Artist: {track.artist || 'Unknown Artist'}
                  <br />
                  Album: {track.album || '—'}
                  <br />
                  Duration:{' '}
                  {track.duration
                    ? `${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60)
                        .toString()
                        .padStart(2, '0')}`
                    : '--:--'}
                  <br />
                  <br />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===================== TRACK DETAILS ===================== */}

        <div className="track-details">
          <h2>🎵 Now Playing</h2>

          {selectedTrack ? (
            <>
              {/* ===================== NOW PLAYING ===================== */}

              <div className="player-header">
                <h3>{selectedTrack.title || selectedTrack.name}</h3>

                <p>
                  {selectedTrack.artist || 'Unknown Artist'}
                  {selectedTrack.album ? ` • ${selectedTrack.album}` : ''}
                </p>
              </div>

              {/* ===================== PROGRESS BAR ===================== */}

              <div className="player-progress">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onInput={(e) => {
                    const time = Number((e.target as HTMLInputElement).value)
                    audio.currentTime = time
                    setCurrentTime(time)
                  }}
                  onMouseDown={() => setIsSeeking(true)}
                  onMouseUp={() => setIsSeeking(false)}
                />

                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* ===================== PLAYER CONTROLS ===================== */}

              <div className="player-controls">
                <button
                  onClick={handlePreviousTrack}
                  disabled={
                    !selectedTrack ||
                    displayedTracks.findIndex((track) => track.path === selectedTrack.path) <= 0
                  }
                >
                  ⏮
                </button>

                <button onClick={handlePlayPause}>{isPlaying ? '⏸' : '▶'}</button>

                <button
                  onClick={handleNextTrack}
                  disabled={
                    !selectedTrack ||
                    displayedTracks.findIndex((track) => track.path === selectedTrack.path) ===
                      displayedTracks.length - 1
                  }
                >
                  ⏭
                </button>
              </div>

              {/* ===================== VOLUME ===================== */}

              <div className="player-volume">
                🔊
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => {
                    const newVolume = Number(e.target.value)

                    setVolume(newVolume)
                    audio.volume = newVolume
                  }}
                />
              </div>

              {/* ===================== METADATA ===================== */}

              <div className="metadata-panel">
                <h3 className="metadata-title">
                  <FileMusic size={20} />
                  Metadata
                </h3>

                {!isEditingMetadata ? (
                  <>
                    <p>
                      <strong>Title</strong>
                    </p>
                    <p>{editedTitle || '-'}</p>

                    <p>
                      <strong>Artist</strong>
                    </p>
                    <p>{editedArtist || '-'}</p>

                    <p>
                      <strong>Album</strong>
                    </p>
                    <p>{editedAlbum || '-'}</p>

                    <button className="metadata-title" onClick={() => setIsEditingMetadata(true)}>
                      <PenSquare /> Edit Metadata
                    </button>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Title</strong>
                    </p>

                    <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />

                    <p>
                      <strong>Artist</strong>
                    </p>

                    <input value={editedArtist} onChange={(e) => setEditedArtist(e.target.value)} />

                    <p>
                      <strong>Album</strong>
                    </p>

                    <input value={editedAlbum} onChange={(e) => setEditedAlbum(e.target.value)} />

                    <div className="metadata-actions">
                      <button onClick={handleSaveMetadata}>Save</button>

                      <button
                        onClick={() => {
                          if (!selectedTrack) return

                          setEditedTitle(selectedTrack.title || '')
                          setEditedArtist(selectedTrack.artist || '')
                          setEditedAlbum(selectedTrack.album || '')

                          setIsEditingMetadata(false)
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <p>No track selected.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
