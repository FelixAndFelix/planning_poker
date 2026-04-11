import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import CardDeck from './CardDeck'

test('renders Fibonacci cards and handles selection', () => {
  const onVote = vi.fn()
  render(<CardDeck onVote={onVote} selectedVote={null} />)

  const cards = ['0', '1', '2', '3', '5', '8', '13', '21', 'Skip']
  cards.forEach((card) => {
    expect(screen.getByRole('button', { name: card })).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: '5' }))
  expect(onVote).toHaveBeenCalledWith('5')
})

test('shows selected vote', () => {
  render(<CardDeck onVote={() => {}} selectedVote="8" />)
  const selectedButton = screen.getByRole('button', { name: '8' })
  expect(selectedButton).toHaveClass('selected')
})
