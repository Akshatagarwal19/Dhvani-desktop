import { useLibrary } from '../context/LibraryContext'
import { calculateLibraryStats, formatDuration } from '../utils/calculateLibraryStats'
import type { Page } from '../types/Page'

type DashboardPageProps = {
  onNavigate: (page: Page) => void
}

function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { tracks, duplicates, selectedFolder } = useLibrary()

  const stats = calculateLibraryStats(tracks, duplicates)
  
  return (
    <div className="dashboard-page">
      <h1>Welcome to Dhvani</h1>

      <p>Your personal desktop music library manager.</p>

      <h2>Current Library</h2>

      {selectedFolder ? (
        <div className="dashboard-library">
          <h3>{selectedFolder.split('\\').pop()}</h3>

          <p>{selectedFolder}</p>
        </div>
      ) : (
        <p>No music library loaded.</p>
      )}
      <p>Total Duration</p>

      <h3>{formatDuration(stats.totalDuration)}</h3>

      <h2>Overview</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>{stats.totalTracks}</h3>
          <p>Songs</p>
        </div>

        <div className="dashboard-card">
          <h3>{stats.totalArtists}</h3>
          <p>Artists</p>
        </div>

        <div className="dashboard-card">
          <h3>{stats.totalAlbums}</h3>
          <p>Albums</p>
        </div>

        <div className="dashboard-card">
          <h3>{stats.duplicateGroups}</h3>
          <p>Duplicate Groups</p>
        </div>
      </div>

      <h2>Library Status</h2>

      <p>
        Missing Artist Metadata: <strong>{stats.missingArtist}</strong>
      </p>

      <p>
        Missing Album Metadata: <strong>{stats.missingAlbum}</strong>
      </p>

      <h2>Quick Actions</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => onNavigate('library')}>
          <h3>📚 Library</h3>
          <p>Browse and manage your music.</p>
        </div>

        <div className="dashboard-card" onClick={() => onNavigate('duplicates')}>
          <h3>🔍 Duplicates</h3>
          <p>Review duplicate tracks.</p>
        </div>

        <div className="dashboard-card" onClick={() => onNavigate('settings')}>
          <h3>⚙ Settings</h3>
          <p>Configure Dhvani.</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
