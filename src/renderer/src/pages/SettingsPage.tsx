import { useLibrary } from '../context/LibraryContext'
import { calculateLibraryStats, formatDuration } from '../utils/calculateLibraryStats'

function SettingsPage() {
  const { tracks, duplicates, selectedFolder } = useLibrary()
  const stats = calculateLibraryStats(tracks, duplicates)

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-grid">
        <section className="settings-card">
          <h2>General</h2>

          <div className="setting-row">
            <span>Version</span>
            <strong>v2.0</strong>
          </div>

          <div className="setting-row">
            <span>Theme</span>
            <strong>Dark</strong>
          </div>

          <div className="setting-row">
            <span>Current Library</span>
            <strong>
              {selectedFolder ? selectedFolder.split('\\').pop() : 'No library selected'}
            </strong>
          </div>
        </section>

        <section className="settings-card">
          <h2>Playback</h2>

          <div className="setting-row">
            <span>Default Volume</span>
            <strong>100%</strong>
          </div>

          <div className="setting-row">
            <span>Progress Seeking</span>
            <strong>Enabled</strong>
          </div>

          <div className="setting-row">
            <span>Auto Play Next</span>
            <strong>Enabled</strong>
          </div>

          <div className="setting-row">
            <span>Metadata Editing</span>
            <strong>Supported</strong>
          </div>
        </section>

        <section className="settings-card">
          <h2>Library</h2>

          <div className="setting-row">
            <span>Songs</span>
            <strong>{stats.totalTracks}</strong>
          </div>

          <div className="setting-row">
            <span>Artists</span>
            <strong>{stats.totalArtists}</strong>
          </div>

          <div className="setting-row">
            <span>Albums</span>
            <strong>{stats.totalAlbums}</strong>
          </div>

          <div className="setting-row">
            <span>Duplicate Groups</span>
            <strong>{stats.duplicateGroups}</strong>
          </div>

          <div className="setting-row">
            <span>Total Duration</span>
            <strong>{formatDuration(stats.totalDuration)}</strong>
          </div>
        </section>

        <section className="settings-card">
          <h2>About</h2>

          <div className="setting-row">
            <span>Application</span>
            <strong>Dhvani</strong>
          </div>

          <div className="setting-row">
            <span>Version</span>
            <strong>v2.0</strong>
          </div>

          <div className="setting-row">
            <span>Framework</span>
            <strong>Electron + React</strong>
          </div>

          <div className="setting-row">
            <span>Language</span>
            <strong>TypeScript</strong>
          </div>

          <div className="setting-row">
            <span>Build Tool</span>
            <strong>Vite</strong>
          </div>

          <div className="setting-row">
            <span>Developer</span>
            <strong>Akshat Agarwal</strong>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
