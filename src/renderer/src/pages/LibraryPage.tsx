import { useState } from 'react'
import type { Track } from '../types/Track.ts'
import { useLibrary } from '../context/LibraryContext'
import { searchTracks } from '../utils/searchTracks'
import { sortTracks } from '../utils/sortTracks'
import type { SortOption } from '../types/SortOption.ts'
import { filterTracks } from '../utils/filterTracks'
import type { FilterOption } from '../types/FilterOption'

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

  console.log('Tracks:', tracks.length)

  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedArtist, setEditedArtist] = useState('')
  const [editedAlbum, setEditedAlbum] = useState('')
  const [audio] = useState(new Audio())
  const [isPlaying, setIsPlaying] = useState(false)

  const searchedTracks = searchTracks(tracks, searchQuery)

  const sortedTracks = sortTracks(searchedTracks, sortOption)

  const displayedTracks = filterTracks(sortedTracks, activeFilter, duplicates)

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

      if (selectedFolder) {
        await loadLibrary(selectedFolder)
      }
    }
  }
  async function handlePlayTrack() {
    if (!selectedTrack) return

    try {
      const bytes = await window.api.readAudioFile(selectedTrack.path)

      const arrayBuffer = new ArrayBuffer(bytes.byteLength)

      new Uint8Array(arrayBuffer).set(bytes)

      const blob = new Blob([arrayBuffer], {
        type: 'audio/mpeg'
      })

      const url = URL.createObjectURL(blob)

      audio.src = url

      await audio.play()

      setIsPlaying(true)
    } catch (error) {
      console.error(error)
    }
  }
  function handlePauseTrack() {
    audio.pause()

    setIsPlaying(false)
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

  return (
    <div className="library-page">
      <div className="library-actions">
        <div className="library-search">
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
        </div>
      ) : (
        <p>No music folder selected.</p>
      )}

      <div className="library-content">
        {/* ===================== TRACK LIST ===================== */}

        <div className="track-list">
          <h2>Tracks ({displayedTracks.length})</h2>

          {tracks.length === 0 ? (
            <p>No supported audio files found.</p>
          ) : (
            <ul>
              {displayedTracks.map((track) => (
                <li
                  key={track.path}
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
          <h2>Selected Track</h2>

          {selectedTrack ? (
            <div>
              <p>
                <strong>Title</strong>
                <br />
                <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
              </p>

              <p>
                <strong>Artist</strong>
                <br />
                <input value={editedArtist} onChange={(e) => setEditedArtist(e.target.value)} />
              </p>

              <p>
                <strong>Album</strong>
                <br />
                <input value={editedAlbum} onChange={(e) => setEditedAlbum(e.target.value)} />
              </p>

              <button onClick={handleSaveMetadata} disabled={!selectedTrack}>
                Save Metadata
              </button>
              <div style={{ marginTop: '20px' }}>
                <button onClick={handlePlayTrack} disabled={!selectedTrack}>
                  ▶ Play
                </button>

                <button onClick={handlePauseTrack} disabled={!selectedTrack}>
                  ⏸ Pause
                </button>

                <button onClick={handleStopTrack} disabled={!selectedTrack}>
                  ⏹ Stop
                </button>
              </div>
              <p>
                <strong>Status:</strong> {isPlaying ? 'Playing' : 'Stopped'}
              </p>
              <p>
                <strong>Track:</strong>{' '}
                {selectedTrack ? selectedTrack.title || selectedTrack.name : 'None'}
              </p>
            </div>
          ) : (
            <p>Select a track.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default LibraryPage
