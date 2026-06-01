import { motion } from 'framer-motion'
import { playClick } from '../lib/audio'
import type { Screen, StudentProfile } from '../types'
import { QuizLayout } from './quiz/QuizLayout'

type Props = {
  profile: StudentProfile
  onDone: () => void
  onNavigate: (screen: Screen) => void
}

export function TutorialScreen({ profile, onDone, onNavigate }: Props) {
  const steps = [
    'Entre com usuário e senha da professora.',
    'Jogue um caso sorteado (~15 min).',
    'Colete pistas — algumas têm pergunta de Química.',
    'Use o laboratório (testes limitados).',
    'Acerte poluente e descarte (50% + 50%).',
    'Veja sua nota e o ranking da turma.',
  ]

  return (
    <QuizLayout profile={profile} activeNav="tutorial" onNavigate={onNavigate}>
      <h2 className="quiz-page-title">Como jogar</h2>
      <p className="quiz-page-lead">Tudo em 4 passos simples dentro de cada caso.</p>

      <div className="quiz-card">
        <ol style={{ margin: 0, paddingLeft: '1.15rem', lineHeight: 1.7 }}>
          {steps.map((s, i) => (
            <motion.li
              key={s}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: '0.5rem', color: 'var(--quiz-text)' }}
            >
              {s}
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="quiz-grid-2">
        {[
          ['🕵️', 'Lucas', 'Investigação'],
          ['👩‍🔬', 'Ana', 'Química'],
          ['🧪', 'André', 'Laboratório'],
          ['🌿', 'Gabriel', 'Ambiente'],
        ].map(([emoji, nome, papel]) => (
          <div key={nome} className="quiz-tile quiz-tile--accent" style={{ cursor: 'default' }}>
            <span className="quiz-tile__icon">{emoji}</span>
            <strong>{nome}</strong>
            <small>{papel}</small>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        className="quiz-btn-primary"
        style={{ width: '100%' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          playClick()
          onDone()
        }}
      >
        Entendi, vamos lá!
      </motion.button>
    </QuizLayout>
  )
}
