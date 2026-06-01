import { ChevronLeft } from 'lucide-react'
import { formatTime } from '../lib/gameEngine'
import { loadProfile, loadReports, normalizeReport } from '../lib/storage'
import type { Screen, StudentProfile } from '../types'
import { playClick } from '../lib/audio'
import { QuizLayout } from './quiz/QuizLayout'

type Props = {
  profile: StudentProfile
  onNavigate: (screen: Screen) => void
}

export function HistoryScreen({ profile, onNavigate }: Props) {
  const p = loadProfile() ?? profile
  const mine = loadReports()
    .map(normalizeReport)
    .filter((r) => r.aluno === p.nome)
    .reverse()

  return (
    <QuizLayout profile={profile} activeNav="menu" onNavigate={onNavigate}>
      <div className="quiz-back-row">
        <button
          type="button"
          className="quiz-back-btn"
          onClick={() => {
            playClick()
            onNavigate('menu')
          }}
          aria-label="Voltar"
        >
          <ChevronLeft aria-hidden size={22} strokeWidth={2} />
        </button>
        <h2 className="quiz-page-title retro" style={{ margin: 0, flex: 1 }}>
          HISTORY
        </h2>
      </div>

      {mine.length === 0 ? (
        <div className="quiz-card bit-box">
          <p className="bit-tagline" style={{ margin: 0 }}>
            Nenhuma investigacao concluida ainda.
          </p>
        </div>
      ) : (
        <div className="quiz-card bit-box">
          {mine.map((r) => {
            const nota = r.notaTotal ?? (r.poluenteCorreto ? 50 : 0) + (r.descarteCorreto ? 50 : 0)
            return (
              <div key={r.id} className="quiz-list-item">
                <span className="quiz-list-rank retro quiz-list-rank--top">
                  {nota >= 80 ? 'A' : nota >= 50 ? 'B' : 'C'}
                </span>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontFamily: 'var(--font-retro)', fontSize: '1.05rem' }}>{r.casoNome}</strong>
                  <small style={{ display: 'block', color: 'var(--quiz-text-muted)' }}>
                    {formatTime(r.tempoSegundos)} · {'*'.repeat(r.estrelas)}
                    {r.modoTreino ? ' · TRAINING' : ''}
                  </small>
                </div>
                <strong className="retro" style={{ color: 'var(--8bit-green)', fontSize: '0.55rem' }}>
                  {nota}
                </strong>
              </div>
            )
          })}
        </div>
      )}
    </QuizLayout>
  )
}
