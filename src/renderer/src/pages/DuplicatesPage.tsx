import { useLibrary } from '../context/LibraryContext'
import { findDuplicates } from '../utils/findDuplicates'
import type { Track } from '../types/Track'

function DuplicatesPage() {
  const { tracks, duplicates, setDuplicates, refreshLibrary } = useLibrary()
  function handleFindDuplicates() {
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

  return (
    <div>
      <h1>Duplicates</h1>

      <button onClick={handleFindDuplicates}>Find Duplicates</button>
      <p>Review duplicate tracks detected in your library.</p>

      <hr />
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
                  <li key={track.path}>
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

export default DuplicatesPage
