function DashboardPage() {
  return (
    <div>
      <h1>Welcome to Dhvani</h1>

      <p>Your desktop music library manager.</p>

      <hr />

      <h2>Quick Actions</h2>

      <button>📚 Open Library</button>

      <button style={{ marginLeft: '10px' }}>
        🔍 Find Duplicates
      </button>

      <hr />

      <h2>Recent Activity</h2>

      <p>No recent activity.</p>
    </div>
  )
}

export default DashboardPage