import { useState } from 'react'
import type { Track } from '../types/Track.ts'

function LibraryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])

  async function handleSelectFolder() {
    const folder = await window.api.selectFolder()

    if (folder) {
      setSelectedFolder(folder)

      const files = await window.api.scanMusicFolder(folder)

      const scannedTracks: Track[] = files.map((file) => ({
        name: file,
        path: `${folder}\\${file}`,
        extension: file.substring(file.lastIndexOf('.'))
      }))

      setTracks(scannedTracks)
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
      <h2>Tracks</h2>

      {tracks.length === 0 ? (
        <p>No supported audio files found.</p>
      ) : (
        <ul>
          {tracks.map((track) => (
            <li key={track.path}>{track.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LibraryPage
