import { useLibrary } from '../context/LibraryContext'
import { useState } from 'react'
import { findDuplicates } from '../utils/findDuplicates'
import type { Track } from '../types/Track'
import { compareTracks } from '../utils/compareTracks'
import { formatBitrate } from '../utils/formatBitrate'
import { formatFileSize } from '../utils/formatFileSize'
import { getRecommendedTrack } from '../utils/getRecommendedTrack'
import { Copy, CheckSquare, Trash2 } from 'lucide-react'

function DuplicatesPage() {
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set())
  const { tracks, duplicates, setDuplicates, refreshLibrary } = useLibrary()
  function handleFindDuplicates() {
    if (tracks.length >= 2) {
      console.log(compareTracks(tracks[0], tracks[1]))
    }
    const duplicateGroups = findDuplicates(tracks)

    setDuplicates(duplicateGroups)
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
    await refreshLibrary()

    handleFindDuplicates()
  }
  async function handleDeleteSelected() {
    const confirmed = window.confirm(
      `Move ${selectedTracks.size} selected track(s) to the Recycle Bin?`
    )

    if (!confirmed) return

    const tracksToDelete = duplicates.flat().filter((track) => selectedTracks.has(track.path))

    let deletedCount = 0

    for (const track of tracksToDelete) {
      const success = await window.api.moveToTrash(track.path)

      if (success) {
        deletedCount++
      }
    }

    alert(`${tracksToDelete.length} file(s) moved to the Recycle Bin.`)

    setSelectedTracks(new Set())

    await refreshLibrary()

    handleFindDuplicates()
  }
  function toggleTrackSelection(trackPath: string) {
    setSelectedTracks((previous) => {
      const updated = new Set(previous)

      if (updated.has(trackPath)) {
        updated.delete(trackPath)
      } else {
        updated.add(trackPath)
      }

      return updated
    })
  }
  function handleSelectDuplicates() {
    const selected = new Set<string>()

    duplicates.forEach((group) => {
      const recommended = getRecommendedTrack(group)

      group.forEach((track) => {
        if (track.path !== recommended.path) {
          selected.add(track.path)
        }
      })
    })

    setSelectedTracks(selected)
  }
  function handleSelectNone() {
    setSelectedTracks(new Set())
  }
  return (
    <div>
      <h1>Duplicates</h1>

      <button onClick={handleFindDuplicates}>Find Duplicates</button>
      <p>Review duplicate tracks detected in your library.</p>

      <hr />
      <div className="duplicate-section">
        <div className="duplicate-actions">
          <button onClick={handleSelectDuplicates}>
            <CheckSquare size={16} />
            Select All
          </button>

          <button style={{ marginLeft: '10px' }} onClick={handleSelectNone}>
            Clear
          </button>
          <button onClick={handleDeleteSelected} disabled={selectedTracks.size === 0}>
            <Trash2 size={16} />
            Delete Selected
          </button>
          <p style={{ marginTop: '10px' }}>
            <strong>{selectedTracks.size}</strong> track{selectedTracks.size !== 1 ? 's' : ''} selected
          </p>
        </div>
        <h2 className="duplicate-heading">
          <Copy size={24} />
          Duplicate Groups ({duplicates.length})
        </h2>

        {duplicates.length === 0 ? (
          <p>No duplicates found.</p>
        ) : (
          duplicates.map((group, index) => {
            const recommended = getRecommendedTrack(group)
            return (
              <div key={index} className="duplicate-group">
                <strong>Duplicate Group {index + 1}</strong>

                <p>{group.length} songs found</p>

                <table className="duplicate-table"                >
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Duration</th>
                      <th>Bitrate</th>
                      <th>Size</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {group.map((track) => (
                      <tr key={track.path}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedTracks.has(track.path)}
                            onChange={() => toggleTrackSelection(track.path)}
                          />
                        </td>
                        <td>
                          {track.title || track.name}

                          {track.path === recommended.path && (
                            <span className="recommended-badge">
                              ⭐ Recommended
                            </span>
                          )}
                        </td>

                        <td>{track.artist || '-'}</td>

                        <td>
                          {track.duration
                            ? `${Math.floor(track.duration / 60)}:${Math.floor(track.duration % 60)
                                .toString()
                                .padStart(2, '0')}`
                            : '-'}
                        </td>

                        <td>{formatBitrate(track.bitrate)}</td>

                        <td>{formatFileSize(track.size)}</td>

                        <td>
                          <button onClick={() => handleDeleteDuplicate(track)}className="delete-track"><Trash2 size={15}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default DuplicatesPage
