import type { StudentProfile } from '../../types'

type Props = {
  profile: StudentProfile
  points?: number | null
}

export function QuizTopBar({ profile, points }: Props) {
  const firstName = profile.nome.split(' ')[0]

  return (
    <header className="quiz-topbar">
      <div className="quiz-avatar" aria-hidden>
        🕵️
      </div>
      <div className="quiz-topbar__text">
        <p className="quiz-topbar__hello">Olá,</p>
        <p className="quiz-topbar__name">{firstName}</p>
      </div>
      {points != null && (
        <div className="quiz-points-pill" title="Sua última nota">
          <span aria-hidden>⭐</span>
          {points}
        </div>
      )}
    </header>
  )
}
