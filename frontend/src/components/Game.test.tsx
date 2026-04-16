import { render, screen, cleanup, act, within, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Game from './Game'

let mockSocketInstance: any = null

class MockWebSocket {
  onopen: () => void = () => {}
  onmessage: (event: any) => void = () => {}
  onerror: (err: any) => void = () => {}
  onclose: () => void = () => {}
  readyState: number = 1 // OPEN
  send = vi.fn()
  close = vi.fn()

  static OPEN = 1

  constructor(public url: string) {
    mockSocketInstance = this
  }
}

vi.stubGlobal('WebSocket', MockWebSocket)

beforeEach(() => {
  sessionStorage.setItem('userName', 'Felix')
  sessionStorage.setItem('userId', 'user-1')
  mockSocketInstance = null
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
})

test('renders game lobby and handles incoming session state', async () => {
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText(/Connecting to lobby test-session/i)).toBeInTheDocument()

  await vi.waitFor(() => expect(mockSocketInstance).not.toBeNull())

  // Manually trigger open
  act(() => {
    mockSocketInstance.onopen()
  })

  // Simulate receiving session state
  const mockSession = {
    id: 'test-session',
    users: {
      'user-1': { id: 'user-1', name: 'Felix', vote: null },
      'user-2': { id: 'user-2', name: 'Alice', vote: '5' }
    },
    revealed: false,
    average: null
  }

  act(() => {
    mockSocketInstance.onmessage({ data: JSON.stringify(mockSession) })
  })

  expect(await screen.findByText(/Felix/i)).toBeInTheDocument()
  expect(await screen.findByText(/Alice/i)).toBeInTheDocument()
  expect(await screen.findByText(/Ready/i)).toBeInTheDocument()
  expect(await screen.findByText(/Thinking/i)).toBeInTheDocument()
})

test('displays revealed votes and average', async () => {
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  await vi.waitFor(() => expect(mockSocketInstance).not.toBeNull())
  
  act(() => {
    mockSocketInstance.onopen()
  })

  const mockSession = {
    id: 'test-session',
    users: {
      'user-1': { id: 'user-1', name: 'Felix', vote: '3' },
      'user-2': { id: 'user-2', name: 'Alice', vote: '5' }
    },
    revealed: true,
    average: 4.0
  }

  act(() => {
    mockSocketInstance.onmessage({ data: JSON.stringify(mockSession) })
  })

  expect(await screen.findByText(/Average Score/i)).toBeInTheDocument()
  expect(await screen.findByText(/4.0/i)).toBeInTheDocument()
  
  const felixCard = screen.getByText(/Felix/i).closest('.participant-card')
  expect(felixCard).not.toBeNull()
  if (felixCard) {
    expect(within(felixCard).getByText('3')).toBeInTheDocument()
  }

  const aliceCard = screen.getByText(/Alice/i).closest('.participant-card')
  expect(aliceCard).not.toBeNull()
  if (aliceCard) {
    expect(within(aliceCard).getByText('5')).toBeInTheDocument()
  }
})

test('handles WebSocket error', async () => {
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  await vi.waitFor(() => expect(mockSocketInstance).not.toBeNull())

  act(() => {
    mockSocketInstance.onerror(new Error('connection failed'))
  })

  expect(await screen.findByRole('heading', { name: /Connection Error/i })).toBeInTheDocument()
})

test('sends vote to WebSocket', async () => {
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  await vi.waitFor(() => expect(mockSocketInstance).not.toBeNull())
  
  act(() => {
    mockSocketInstance.onopen()
  })

  const mockSession = {
    id: 'test-session',
    users: { 'user-1': { id: 'user-1', name: 'Felix', vote: null } },
    revealed: false,
    average: null
  }
  act(() => {
    mockSocketInstance.onmessage({ data: JSON.stringify(mockSession) })
  })

  const voteButton = await screen.findByRole('button', { name: '3' })
  fireEvent.click(voteButton)

  expect(mockSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({ type: 'vote', vote: '3' }))
})

test('sends reveal to WebSocket', async () => {
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  await vi.waitFor(() => expect(mockSocketInstance).not.toBeNull())
  
  act(() => {
    mockSocketInstance.onopen()
  })

  const mockSession = {
    id: 'test-session',
    users: { 'user-1': { id: 'user-1', name: 'Felix', vote: '3' } },
    revealed: false,
    average: null
  }
  act(() => {
    mockSocketInstance.onmessage({ data: JSON.stringify(mockSession) })
  })

  const revealButton = await screen.findByRole('button', { name: /reveal/i })
  fireEvent.click(revealButton)

  expect(mockSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reveal' }))
})

test('sends reset to WebSocket', async () => {
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  await vi.waitFor(() => expect(mockSocketInstance).not.toBeNull())
  
  act(() => {
    mockSocketInstance.onopen()
  })

  const mockSession = {
    id: 'test-session',
    users: { 'user-1': { id: 'user-1', name: 'Felix', vote: '3' } },
    revealed: true,
    average: 3.0
  }
  act(() => {
    mockSocketInstance.onmessage({ data: JSON.stringify(mockSession) })
  })

  const resetButton = await screen.findByRole('button', { name: /reset/i })
  fireEvent.click(resetButton)

  expect(mockSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reset' }))
})

