import { motion } from 'framer-motion'
import { playClick } from '../lib/audio'
import type { Screen, StudentProfile } from '../types'
import { QuizLayout } from './quiz/QuizLayout'

type Props = {
  profile: StudentProfile
  onDone: () => void
  onNavigate: (screen: Screen) => void
}

const STEPS = [
  'Digite seu nome e escolha a dificuldade.',
  'Leia o caso e va ao mapa.',
  '5 perguntas no mapa — do mais facil ao mais dificil.',
  'Acerte poluente + descarte no veredito.',
  'Veja sua nota e o ranking.',
]

const CREW = [
  { nome: 'LUCAS', papel: 'INVESTIGACAO', color: 'var(--8bit-blue)' },
  { nome: 'ANA', papel: 'QUIMICA', color: 'var(--8bit-green)' },
  { nome: 'ANDRE', papel: 'LAB', color: 'var(--8bit-yellow)' },
  { nome: 'GABRIEL', papel: 'AMBIENTE', color: 'var(--8bit-red)' },
]

export function TutorialScreen({ profile, onDone, onNavigate }: Props) {
  return (
    <QuizLayout profile={profile} activeNav="tutorial" onNavigate={onNavigate}>
      <h2 className="quiz-page-title retro">HOW TO PLAY</h2>
      <p className="quiz-page-lead">3 fases: caso → mapa (5 perguntas) → veredito.</p>

      <div className="quiz-card bit-box">
        <ol className="bit-step-list">
          {STEPS.map((s, i) => (
            <motion.li
              key={s}
              className="bit-step-list__item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.15 }}
            >
              <span className="bit-step-list__num retro">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="bit-crew-grid">
        {CREW.map((c) => (
          <div key={c.nome} className="bit-crew-card bit-box" style={{ borderColor: c.color }}>
            <strong className="retro" style={{ color: c.color, fontSize: '0.5rem' }}>
              {c.nome}
            </strong>
            <small className="retro" style={{ fontSize: '0.4rem' }}>
              {c.papel}
            </small>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        className="quiz-btn-primary bit-btn bit-btn--green retro"
        style={{ width: '100%' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          playClick()
          onDone()
        }}
      >
        ▶ CONTINUE
      </motion.button>
    </QuizLayout>
  )
}
