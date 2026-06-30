import { useEffect, useState } from 'react'
import type { Track } from '../types/Track.ts'

function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedArtist, setEditedArtist] = useState('')
  const [editedAlbum, setEditedAlbum] = useState('')
  const [duplicates, setDuplicates] = useState<Track[][]>([])
  const [audio] = useState(new Audio())
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    audio.onended = () => {
      setIsPlaying(false)
    }
  }, [audio])
  async function loadLibrary(folder: string) {
    const scannedTracks = await window.api.scanMusicFolder(folder)

    setTracks(scannedTracks)
    handleFindDuplicates(scannedTracks)
  }
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
  function handleFindDuplicates(trackList: Track[] = tracks) {
    const duplicateMap = new Map<string, Track[]>()

    trackList.forEach((track) => {
      const key = `${(track.title ?? '').toLowerCase().trim()}|${(track.artist ?? '').toLowerCase().trim()}|${Math.round(track.duration ?? 0)}`

      if (!duplicateMap.has(key)) {
        duplicateMap.set(key, [])
      }

      duplicateMap.get(key)!.push(track)
    })

    const duplicateGroups = Array.from(duplicateMap.values()).filter((group) => group.length > 1)

    setDuplicates(duplicateGroups)
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
  async function handleDeleteDuplicate(track: Track) {
    const confirmed = window.confirm(`Move "${track.title || track.name}" to the Recycle Bin?`)

    if (!confirmed) return

    const success = await window.api.moveToTrash(track.path)

    if (!success) {
      alert('Unable to move file to Recycle Bin.')
      return
    }

    alert('File moved to Recycle Bin.')
    if (selectedFolder) {
      await loadLibrary(selectedFolder)
    }

    if (selectedTrack?.path === track.path) {
      handleStopTrack()

      setSelectedTrack(null)

      setEditedTitle('')
      setEditedArtist('')
      setEditedAlbum('')
    }
  }

  return (
    <div className="library-page">
      <h1>Library</h1>

      <div className="library-actions">
        <button onClick={handleSelectFolder}>Select Music Folder</button>

        <button onClick={() => handleFindDuplicates()}>Find Duplicates</button>
      </div>

      {selectedFolder ? (
        <p>
          <strong>Selected Folder:</strong>
          <br />
          {selectedFolder}
        </p>
      ) : (
        <p>No music folder selected.</p>
      )}

      <div className="library-content">
        {/* ===================== TRACK LIST ===================== */}

        <div className="track-list">
          <h2>Tracks ({tracks.length})</h2>

          {tracks.length === 0 ? (
            <p>No supported audio files found.</p>
          ) : (
            <ul>
              {tracks.map((track) => (
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

      {/* ===================== DUPLICATES ===================== */}

      <div className="duplicate-section">
        <h2>Duplicate Groups ({duplicates.length})</h2>

        {duplicates.length === 0 ? (
          <p>No duplicates found.</p>
        ) : (
          duplicates.map((group, index) => (
            <div
              key={index}
              style={{
                border: '1px solid gray',
                marginBottom: '12px',
                padding: '10px'
              }}
            >
              <strong>Duplicate Group {index + 1}</strong>

              <p>{group.length} songs found</p>

              <ul>
                {group.map((track) => (
                  <li
                    key={track.path}
                    className={selectedTrack?.path === track.path ? 'selected-track' : ''}
                  >
                    {track.title || track.name}

                    <button
                      style={{ marginLeft: '10px' }}
                      onClick={() => handleDeleteDuplicate(track)}
                    >
                      Move to Recycle Bin
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LibraryPage
