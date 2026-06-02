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
      <h2 className="quiz-page-title retro">SOBRE O JOGO</h2>
      <p className="quiz-page-lead">
        {SCHOOL.nome} · {SCHOOL.professora}
      </p>

      <div className="quiz-card bit-box">
        <p style={{ margin: 0, lineHeight: 1.5, fontSize: '1.15rem' }}>
          <strong className="retro" style={{ fontSize: '0.55rem', color: 'var(--8bit-green)' }}>
            DETETIVES DA POLUICAO
          </strong>
          <br />
          Jogo de Quimica ambiental — {SCHOOL.serie}. Investigue contaminacoes reais.
        </p>
      </div>

      <div className="quiz-card bit-box">
        <h3 className="retro" style={{ margin: '0 0 0.5rem', fontSize: '0.55rem', color: 'var(--8bit-green)' }}>
          EQUIPE
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6, fontSize: '1.1rem' }}>
          {AUTHORS.map((a) => (
            <li key={a.nome}>
              <strong>{a.nome}</strong> — {a.papel}
            </li>
          ))}
        </ul>
      </div>

      <div className="quiz-card bit-box">
        <h3 className="retro" style={{ margin: '0 0 0.5rem', fontSize: '0.55rem', color: 'var(--8bit-green)' }}>
          CASOS ({CASES.length})
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.6, fontSize: '1.05rem' }}>
          {CASES.map((c) => (
            <li key={c.id}>
              {c.emoji} {c.nome}
            </li>
          ))}
        </ul>
      </div>

      <p className="bit-tagline" style={{ textAlign: 'center', fontSize: '1rem' }}>
        PWA · {new Date().getFullYear()} · BNCC EM
      </p>
    </QuizLayout>
  )
}
