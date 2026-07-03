import { useState } from 'react'

import MainLayout from './layouts/MainLayout'

import LibraryPage from './pages/LibraryPage'
import DashboardPage from './pages/DashboardPage'
import DuplicatesPage from './pages/DuplicatesPage'
import SettingsPage from './pages/SettingsPage'

import type { Page } from './types/Page'
import { LibraryProvider } from './context/LibraryContext'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const pages = {
    dashboard: DashboardPage,
    library: LibraryPage,
    duplicates: DuplicatesPage,
    settings: SettingsPage
  }

  const CurrentPage = pages[currentPage]

  return (
  <LibraryProvider>
    <MainLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      <CurrentPage />
    </MainLayout>
  </LibraryProvider>
)
}

export default App
