import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Hash, Plus, ArrowRight, Copy } from 'lucide-react'
import './Join.css'

export default function Join() {
  const [name, setName] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAction = (type: 'create' | 'join') => {
    if (!name.trim()) {
      setError('Please enter your name first.')
      return
    }

    let sid = sessionId.trim()
    if (type === 'create') {
      sid = Math.random().toString(36).substring(2, 9)
    } else if (!sid) {
      setError('Please enter a Lobby ID to join.')
      return
    }

    sessionStorage.setItem('userName', name.trim())
    navigate(`/${sid}`)
  }

  const copyToClipboard = () => {
    if (!sessionId.trim()) return
    const url = `${window.location.origin}/${sessionId.trim()}`
    navigator.clipboard.writeText(url)
    // In a real app, we'd show a toast here
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <div className="join-header">
          <h1>Planning Poker</h1>
          <p className="subtitle">Collaborative Estimation for Teams</p>
        </div>

        <div className="join-content">
          <div className="input-group">
            <label htmlFor="name">
              <User size={18} /> Your Name
            </label>
            <div className="input-wrapper">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Your name"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="sessionId">
              <Hash size={18} /> Lobby ID
            </label>
            <div className="input-wrapper with-action">
              <input
                id="sessionId"
                type="text"
                value={sessionId}
                onChange={(e) => {
                  setSessionId(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Lobby ID"
              />
              <button 
                type="button" 
                className="icon-button" 
                onClick={copyToClipboard}
                disabled={!sessionId.trim()}
                title="Copy Invite Link"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="actions">
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => handleAction('create')}
            >
              <Plus size={18} /> Create Session
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => handleAction('join')}
            >
              Join Session <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
