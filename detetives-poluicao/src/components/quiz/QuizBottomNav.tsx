import { BookOpen, Home, Info, Trophy } from 'lucide-react'
import type { Screen } from '../../types'
import { playClick } from '../../lib/audio'

export type QuizNavId = 'menu' | 'ranking' | 'tutorial' | 'about'

type Props = {
  active: QuizNavId
  onNavigate: (screen: Screen) => void
}

const items: {
  id: QuizNavId
  screen: Screen
  Icon: typeof Home
  label: string
}[] = [
  { id: 'menu', screen: 'menu', Icon: Home, label: 'Início' },
  { id: 'ranking', screen: 'ranking', Icon: Trophy, label: 'Ranking' },
  { id: 'tutorial', screen: 'tutorial', Icon: BookOpen, label: 'Aprender' },
  { id: 'about', screen: 'about', Icon: Info, label: 'Sobre' },
]

export function QuizBottomNav({ active, onNavigate }: Props) {
  return (
    <nav className="quiz-bottom-nav" aria-label="Menu principal">
      {items.map(({ id, screen, Icon, label }) => (
        <button
          key={id}
          type="button"
          className={`quiz-nav-item${active === id ? ' quiz-nav-item--active' : ''}`}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => {
            playClick()
            onNavigate(screen)
          }}
        >
          <Icon aria-hidden strokeWidth={2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
