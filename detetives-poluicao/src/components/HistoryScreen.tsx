import { ChevronLeft, Search } from 'lucide-react'
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
    <QuizLayout profile={profile} activeNav="menu" onNavigate={onNavigate} showBottomNav>
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
        <h2 className="quiz-page-title" style={{ margin: 0 }}>
          Histórico
        </h2>
      </div>

      {mine.length === 0 ? (
        <div className="quiz-card">
          <p style={{ margin: 0, color: 'var(--quiz-text-muted)' }}>Você ainda não concluiu investigações.</p>
        </div>
      ) : (
        <div className="quiz-card">
          {mine.map((r) => {
            const nota = r.notaTotal ?? (r.poluenteCorreto ? 50 : 0) + (r.descarteCorreto ? 50 : 0)
            return (
              <div key={r.id} className="quiz-list-item">
                <span className="quiz-list-rank quiz-list-rank--icon" aria-hidden>
                  <Search size={16} strokeWidth={2} />
                </span>
                <div style={{ flex: 1 }}>
                  <strong>{r.casoNome}</strong>
                  <small style={{ display: 'block', color: 'var(--quiz-text-muted)' }}>
                    {formatTime(r.tempoSegundos)} · {'★'.repeat(r.estrelas)}
                    {r.modoTreino ? ' · treino' : ''}
                  </small>
                </div>
                <strong style={{ color: 'var(--quiz-green)' }}>{nota}</strong>
              </div>
            )
          })}
        </div>
      )}
    </QuizLayout>
  )
}
