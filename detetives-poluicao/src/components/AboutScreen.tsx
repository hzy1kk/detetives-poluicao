import { AUTHORS, SCHOOL } from '../data/config'
import { CASES } from '../data/cases'
import type { Screen, StudentProfile } from '../types'
import { QuizLayout } from './quiz/QuizLayout'

type Props = {
  profile: StudentProfile
  onNavigate: (screen: Screen) => void
}

export function AboutScreen({ profile, onNavigate }: Props) {
  return (
    <QuizLayout profile={profile} activeNav="about" onNavigate={onNavigate}>
      <h2 className="quiz-page-title">Sobre</h2>
      <p className="quiz-page-lead">
        {SCHOOL.nome} · {SCHOOL.professora}
      </p>

      <div className="quiz-card">
        <p style={{ margin: 0, lineHeight: 1.55 }}>
          <strong>Detetives da Poluição</strong> é um jogo de Química ambiental para o {SCHOOL.serie}.
          Investigue contaminações reais e aprenda descarte correto.
        </p>
      </div>

      <div className="quiz-card">
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Equipe</h3>
        <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6 }}>
          {AUTHORS.map((a) => (
            <li key={a.nome}>
              <strong>{a.nome}</strong> — {a.papel}
            </li>
          ))}
        </ul>
      </div>

      <div className="quiz-card">
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Casos ({CASES.length})</h3>
        <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6 }}>
          {CASES.map((c) => (
            <li key={c.id}>
              {c.emoji} {c.nome}
            </li>
          ))}
        </ul>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--quiz-text-muted)', textAlign: 'center' }}>
        PWA · {new Date().getFullYear()} · BNCC Ensino Médio
      </p>
    </QuizLayout>
  )
}
