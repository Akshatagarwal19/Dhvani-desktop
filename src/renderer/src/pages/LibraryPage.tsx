import { useState } from 'react'
import type { Track } from '../types/Track.ts'

function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedArtist, setEditedArtist] = useState('')
  const [editedAlbum, setEditedAlbum] = useState('')

  async function handleSelectFolder() {
    const folder = await window.api.selectFolder()

    if (folder) {
      setSelectedFolder(folder)

      const scannedTracks = await window.api.scanMusicFolder(folder)

      setTracks(scannedTracks)

      console.log(scannedTracks)
      console.log(scannedTracks)
    }
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
    }
  }
  return (
    <div>
      <h1>Library</h1>

      <button onClick={handleSelectFolder}>Select Music Folder</button>

      <br />
      <br />

      {selectedFolder ? (
        <p>
          <strong>Selected Folder:</strong>
          <br />
          {selectedFolder}
        </p>
      ) : (
        <p>No music folder selected.</p>
      )}
      <h2>Tracks ({tracks.length})</h2>

      {tracks.length === 0 ? (
        <p>No supported audio files found.</p>
      ) : (
        <ul>
          {tracks.map((track) => (
            <li
              key={track.path}
              onClick={() => {
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
              Album: {track.album || 'Album: —'}
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
      <hr />

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
        </div>
      ) : (
        <p>Select a track.</p>
      )}
      <button onClick={handleSaveMetadata}>Save Metadata</button>
    </div>
  )
}

export default LibraryPage
