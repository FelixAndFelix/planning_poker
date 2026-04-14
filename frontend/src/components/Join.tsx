import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Join() {
  const [name, setName] = useState('')
  const [sessionId, setSessionId] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const sid = sessionId.trim() || Math.random().toString(36).substring(2, 9)
    // Store user name in session storage for the game component to use
    sessionStorage.setItem('userName', name)
    navigate(`/${sid}`)
  }

  return (
    <div className="join-container">
      <h1>Join a Lobby</h1>
      <form onSubmit={handleJoin}>
        <div>
          <label htmlFor="name">Your Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="sessionId">Lobby ID (optional):</label>
          <input
            id="sessionId"
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Lobby ID"
          />
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  )
}
