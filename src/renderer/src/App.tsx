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

  

return (
  <LibraryProvider>
    <MainLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {currentPage === 'dashboard' && (
        <DashboardPage onNavigate={setCurrentPage} />
      )}

      {currentPage === 'library' && <LibraryPage />}

      {currentPage === 'duplicates' && <DuplicatesPage />}

      {currentPage === 'settings' && <SettingsPage />}
    </MainLayout>
  </LibraryProvider>
)
}

export default App
