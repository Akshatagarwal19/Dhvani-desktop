import type { Page } from '../types/Page'
import { LayoutDashboard, Library, Copy, Settings,Music4 } from 'lucide-react'

type SidebarProps = {
  currentPage: Page
  onNavigate: (page: Page) => void
}

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <Music4 size={28} />

        <div>
          <h2>Dhvani</h2>

          <span>Desktop Music Library</span>
        </div>
      </div>

      <nav>
        <button
          className={`nav-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-button ${currentPage === 'library' ? 'active' : ''}`}
          onClick={() => onNavigate('library')}
        >
          <Library size={20} strokeWidth={2} />

          <span>Library</span>
        </button>

        <button
          className={`nav-button ${currentPage === 'duplicates' ? 'active' : ''}`}
          onClick={() => onNavigate('duplicates')}
        >
          <Copy size={20} strokeWidth={2} />

          <span>Duplicates</span>
        </button>

        <button
          className={`nav-button ${currentPage === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <Settings size={20} strokeWidth={2} />

          <span>Settings</span>
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
