import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Info, Eye, RotateCcw, ChevronLeft } from 'lucide-react'
import CardDeck from './CardDeck'
import './Game.css'

interface User {
  id: string
  name: string
  vote: string | null
}

interface Session {
  id: string
  users: Record<string, User>
  revealed: boolean
  average: number | null
}

export default function Game() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const userName = sessionStorage.getItem('userName')
    if (!userName) {
      navigate('/')
      return
    }

    let userId = sessionStorage.getItem('userId')
    if (!userId) {
      userId = Math.random().toString(36).substring(2, 9)
      sessionStorage.setItem('userId', userId)
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isProd = import.meta.env.PROD
    
    // Determine backend host
    let host = window.location.host
    if (isLocal && !isProd) {
      host = `${window.location.hostname}:8000`
    }

    const socketUrl = `${protocol}//${host}/ws/${sessionId}/${userId}?name=${encodeURIComponent(userName)}`

    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onopen = () => {
      setError(null)
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setSession(data)
    }

    socket.onerror = (err) => {
      console.error('WebSocket error:', err)
      setError('Connection error. Is the backend running?')
    }

    return () => {
      socket.close()
    }
  }, [sessionId, navigate])

  const handleVote = (vote: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'vote', vote }))
    }
  }

  const handleReveal = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'reveal' }))
    }
  }

  const handleReset = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'reset' }))
    }
  }

  if (error) {
    return (
      <div className="game-page centered">
        <div className="status-card error">
          <Info size={48} />
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to Join
          </button>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="game-page centered">
        <div className="status-card">
          <div className="loader"></div>
          <p>Connecting to lobby {sessionId}...</p>
        </div>
      </div>
    )
  }

  const users = Object.values(session.users)
  const userId = sessionStorage.getItem('userId')
  const currentUserVote = userId ? session.users[userId]?.vote : null

  return (
    <div className="game-page">
      <header className="game-header">
        <button className="icon-button" onClick={() => navigate('/')} title="Leave Session">
          <ChevronLeft size={24} />
        </button>
        <div className="header-info">
          <h1>Lobby: {sessionId}</h1>
          <p className="subtitle">{users.length} Participants</p>
        </div>
        <div className="header-actions">
          {!session.revealed ? (
            <button className="btn btn-primary btn-sm" onClick={handleReveal}>
              <Eye size={18} /> Reveal
            </button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={18} /> Reset
            </button>
          )}
        </div>
      </header>

      <main className="game-main">
        <section className="participants-section">
          <div className="section-header">
            <Users size={20} />
            <h2>Participants</h2>
          </div>
          <div className="participants-grid">
            {users.map((user) => (
              <div key={user.id} className={`participant-card ${user.vote ? 'has-voted' : ''} ${session.revealed ? 'revealed' : ''}`}>
                <div className="participant-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="participant-info">
                  <span className="participant-name">{user.name}</span>
                  <span className="participant-status">
                    {session.revealed 
                      ? (user.vote ? 'Voted' : 'No vote') 
                      : (user.vote ? 'Ready' : 'Thinking...')}
                  </span>
                </div>
                <div className="participant-vote">
                  {session.revealed ? (
                    <span className="vote-value">{user.vote ?? '-'}</span>
                  ) : (
                    <div className="vote-placeholder">
                      {user.vote ? <div className="dot"></div> : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {session.revealed && session.average !== null && (
          <section className="results-section">
             <div className="results-card">
                <span className="results-label">Average Score</span>
                <span className="results-value">{session.average.toFixed(1)}</span>
             </div>
          </section>
        )}
      </main>

      <footer className="game-footer">
        <div className="deck-container">
          <CardDeck onVote={handleVote} selectedVote={currentUserVote} />
        </div>
      </footer>
    </div>
  )
}
