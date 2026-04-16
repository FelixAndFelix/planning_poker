import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Join from './Join'

// Mock useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

beforeEach(() => {
  mockedUsedNavigate.mockClear();
});

test('renders all lobby elements according to spec', () => {
  render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  )

  expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/lobby id/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /create session/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /join session/i })).toBeInTheDocument()
})

test('prevents joining with empty name', () => {
  render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  )

  const joinButton = screen.getByRole('button', { name: /join session/i })
  fireEvent.click(joinButton)

  // Navigate should not have been called
  expect(mockedUsedNavigate).not.toHaveBeenCalled()
  expect(screen.getByText(/please enter your name first/i)).toBeInTheDocument()
})

test('creates a new session when "Create Session" is clicked', () => {
  render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  )

  const nameInput = screen.getByPlaceholderText(/your name/i)
  const createButton = screen.getByRole('button', { name: /create session/i })

  fireEvent.change(nameInput, { target: { value: 'Felix' } })
  fireEvent.click(createButton)

  expect(mockedUsedNavigate).toHaveBeenCalledWith(expect.stringMatching(/^\/[a-z0-9]+$/))
  expect(sessionStorage.getItem('userName')).toBe('Felix')
})


test('joins an existing session when "Join Session" is clicked with ID', () => {
  mockedUsedNavigate.mockClear()
  render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  )

  const nameInput = screen.getByPlaceholderText(/your name/i)
  const idInput = screen.getByPlaceholderText(/lobby id/i)
  const joinButton = screen.getByRole('button', { name: /join session/i })

  fireEvent.change(nameInput, { target: { value: 'Felix' } })
  fireEvent.change(idInput, { target: { value: 'test-room' } })
  fireEvent.click(joinButton)

  expect(mockedUsedNavigate).toHaveBeenCalledWith('/test-room')
})

test('prevents joining with empty session ID', () => {
  render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  )

  const nameInput = screen.getByPlaceholderText(/your name/i)
  const joinButton = screen.getByRole('button', { name: /join session/i })

  fireEvent.change(nameInput, { target: { value: 'Felix' } })
  fireEvent.click(joinButton)

  expect(mockedUsedNavigate).not.toHaveBeenCalled()
  expect(screen.getByText(/please enter a lobby id to join/i)).toBeInTheDocument()
})

test('copies invite link to clipboard', async () => {

  // Mock clipboard
  const writeTextMock = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, {
    clipboard: {
      writeText: writeTextMock,
    },
  })

  render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  )

  const idInput = screen.getByPlaceholderText(/lobby id/i)
  const copyButton = screen.getByTitle(/copy invite link/i)

  fireEvent.change(idInput, { target: { value: 'test-room' } })
  fireEvent.click(copyButton)

  expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('/test-room'))
})

