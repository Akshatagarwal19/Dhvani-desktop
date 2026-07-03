import type { Page } from '../types/Page'

type SidebarProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2 className="logo">🎵 Dhvani</h2>

      <nav>
        <button
          className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          🏠 Dashboard
        </button>

        <button
          className={`nav-button ${currentPage === 'library' ? 'active' : ''}`}
          onClick={() => onNavigate('library')}
        >
          📚 Library
        </button>

        <button
          className={`nav-button ${currentPage === 'duplicates' ? 'active' : ''}`}
          onClick={() => onNavigate('duplicates')}
        >
          🔍 Duplicates
        </button>

        <button
          className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          ⚙ Settings
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar