import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import type { Page } from '../types/Page'

type MainLayoutProps = {
  children: React.ReactNode
  currentPage: Page
  onNavigate: (page: Page) => void
}

function MainLayout({
  children,
  currentPage,
  onNavigate
}: MainLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      <div className="content-wrapper">
        <Header currentPage={currentPage} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout