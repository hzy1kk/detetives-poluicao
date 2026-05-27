import type { Screen } from '../../types'
import { playClick } from '../../lib/audio'

export type QuizNavId = 'menu' | 'ranking' | 'tutorial' | 'about'

type Props = {
  active: QuizNavId
  onNavigate: (screen: Screen) => void
}

const items: { id: QuizNavId; screen: Screen; icon: string; label: string }[] = [
  { id: 'menu', screen: 'menu', icon: '🏠', label: 'Início' },
  { id: 'ranking', screen: 'ranking', icon: '🏆', label: 'Ranking' },
  { id: 'tutorial', screen: 'tutorial', icon: '📖', label: 'Aprender' },
  { id: 'about', screen: 'about', icon: '👤', label: 'Sobre' },
]

export function QuizBottomNav({ active, onNavigate }: Props) {
  return (
    <nav className="quiz-bottom-nav" aria-label="Menu principal">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`quiz-nav-item${active === item.id ? ' quiz-nav-item--active' : ''}`}
          onClick={() => {
            playClick()
            onNavigate(item.screen)
          }}
        >
          <span aria-hidden>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
