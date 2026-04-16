import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders initial component', () => {
  render(<App />)
  // Check for the title inside the Join card
  const planning_poker_elements = screen.getAllByText('Planning Poker')
  expect(planning_poker_elements.length).toBeGreaterThan(0)
  expect(screen.getByText('Collaborative Estimation for Teams')).toBeInTheDocument()
})
