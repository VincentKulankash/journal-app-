import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import Journal from './pages/journal'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="app">
      {user ? (
        <Journal user={user} onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </div>
  )
}

export default App