import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Game from './Game'

test('renders game lobby with session id', () => {
  sessionStorage.setItem('userName', 'Felix')
  render(
    <MemoryRouter initialEntries={['/test-session']}>
      <Routes>
        <Route path="/:sessionId" element={<Game />} />
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText(/Connecting to lobby test-session/i)).toBeInTheDocument()
})
