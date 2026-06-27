import { useState } from 'react'
import type { Track } from '../types/Track.ts'

function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])

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
            <li key={track.path}>
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
    </div>
  )
}

export default LibraryPage
