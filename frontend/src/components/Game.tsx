import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CardDeck from './CardDeck'

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
    // For development we assume backend on port 8000. 
    // In production (Docker), we use the current host and port (Nginx handles proxying).
    const backendPort = '8000'
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isProd = import.meta.env.PROD
    const host = (isLocal && !isProd) ? `${window.location.hostname}:${backendPort}` : window.location.host
    const socketUrl = `${protocol}//${host}/ws/${sessionId}/${userId}?name=${encodeURIComponent(userName)}`

    console.log('Connecting to WebSocket:', socketUrl)

    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onopen = () => {
      console.log('WebSocket connected to', socketUrl)
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

    socket.onclose = () => {
      console.log('WebSocket disconnected')
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
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Join</button>
      </div>
    )
  }

  if (!session) {
    return <div>Connecting to lobby {sessionId}...</div>
  }

  const users = Object.values(session.users)
  const userId = sessionStorage.getItem('userId')
  const currentUserVote = userId ? session.users[userId]?.vote : null

  return (
    <div className="game-container">
      <h1>Lobby: {sessionId}</h1>
      <div className="users-list">
        <h2>Participants</h2>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name}: {session.revealed ? (user.vote ?? 'No vote') : (user.vote ? '✅' : '⏳')}
            </li>
          ))}
        </ul>
      </div>

      {session.revealed && session.average !== null && (
        <div className="results">
          <h2>Average: {session.average.toFixed(1)}</h2>
          <button className="reset-button" onClick={handleReset}>
            Reset Round
          </button>
        </div>
      )}

      {!session.revealed && (
        <button className="reveal-button" onClick={handleReveal}>
          Reveal Votes
        </button>
      )}

      <CardDeck onVote={handleVote} selectedVote={currentUserVote} />
    </div>
  )
}
