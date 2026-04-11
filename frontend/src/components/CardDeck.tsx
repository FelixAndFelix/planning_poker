const FIBONACCI_CARDS = ['0', '1', '2', '3', '5', '8', '13', '21', 'Skip']

interface CardDeckProps {
  onVote: (vote: string) => void
  selectedVote: string | null
}

export default function CardDeck({ onVote, selectedVote }: CardDeckProps) {
  return (
    <div className="card-deck">
      <h2>Cast your vote</h2>
      <div className="cards-grid">
        {FIBONACCI_CARDS.map((card) => (
          <button
            key={card}
            className={`card ${selectedVote === card ? 'selected' : ''}`}
            onClick={() => onVote(card)}
            aria-label={card}
          >
            {card}
          </button>
        ))}
      </div>
    </div>
  )
}
