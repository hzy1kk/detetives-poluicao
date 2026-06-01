import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatTime } from '../lib/gameEngine'
import { playClick } from '../lib/audio'
import type { GameCase, Report } from '../types'
import { downloadJson } from '../lib/storage'
import { GOOGLE_FORMS_URL } from '../data/config'
import { CelebrationScene } from './scene/CelebrationScene'

const CONFETTI_COLORS = ['#ffec27', '#29adff', '#00e436', '#ff0044', '#ffffff']

type Props = {
  report: Report
  gameCase: GameCase
  onMenu: () => void
  onPlayAgain: () => void
}

export function ResultScreen({ report, gameCase, onMenu, onPlayAgain }: Props) {
  const [showCelebration, setShowCelebration] = useState(true)
  const stars = '★'.repeat(report.estrelas) + '☆'.repeat(3 - report.estrelas)

  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.8}s`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    [],
  )

  function copiarCodigo() {
    playClick()
    navigator.clipboard.writeText(report.codigoExport)
  }

  return (
    <>
      <AnimatePresence>
        {showCelebration && (
          <CelebrationScene
            tier={report.performanceTier}
            notaTotal={report.notaTotal}
            onContinue={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>

      <div className="quiz-shell quiz-shell--no-nav">
        {report.correto && !showCelebration && (
          <div className="confetti-burst confetti-burst--max" aria-hidden>
            {confetti.map((c) => (
              <span
                key={c.id}
                style={{
                  left: c.left,
                  top: '-8px',
                  background: c.color,
                  animationDelay: c.delay,
                }}
              />
            ))}
          </div>
        )}

        <div className="quiz-result-hero bit-box" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <p className="retro bit-result-badge">
            {report.correto ? 'STAGE CLEAR' : 'GAME OVER'}
          </p>
          <h2 className="quiz-page-title retro" style={{ marginBottom: '0.5rem' }}>
            {report.correto ? 'CASE SOLVED' : 'TRY AGAIN'}
          </h2>
          <p className="retro bit-stars" aria-label={`${report.estrelas} estrelas`}>
            {stars}
          </p>
        </div>

        <div className="quiz-score-grid">
          <div className={`quiz-score-box bit-stat${report.poluenteCorreto ? '' : ' quiz-score-box--fail'}`}>
            <span className="retro">POLLUTER</span>
            <strong>{report.notaPoluente}</strong>
          </div>
          <div className={`quiz-score-box bit-stat${report.descarteCorreto ? '' : ' quiz-score-box--fail'}`}>
            <span className="retro">DISPOSE</span>
            <strong>{report.notaDescarte}</strong>
          </div>
          <div className="quiz-score-box quiz-score-box--total bit-stat">
            <span className="retro">SCORE</span>
            <strong>{report.notaTotal}</strong>
          </div>
        </div>

        <div className="quiz-card">
          <p style={{ margin: '0 0 0.5rem', color: 'var(--quiz-text-muted)', fontSize: '0.88rem' }}>
            Tempo {formatTime(report.tempoSegundos)} · {report.pontuacao} pts bônus
          </p>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Para explicar em sala</h3>
          <ol style={{ margin: 0, paddingLeft: '1.1rem', lineHeight: 1.55, fontSize: '0.9rem' }}>
            {gameCase.aprendizados.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
        </div>

        <details className="quiz-card">
          <summary style={{ fontWeight: 700, cursor: 'pointer' }}>Ver explicação completa</summary>
          <p style={{ marginTop: '0.75rem', lineHeight: 1.5, fontSize: '0.9rem' }}>
            <strong>Fonte:</strong> {report.suspeitoEscolhido}
            <br />
            <strong>Descarte:</strong> {report.descarteEscolhido}
          </p>
          <p style={{ lineHeight: 1.5, fontSize: '0.9rem' }}>{gameCase.explicacao}</p>
          {!report.correto && (
            <p style={{ fontSize: '0.88rem', color: 'var(--fusion-cyan)' }}>
              <strong>Gabarito:</strong> {gameCase.gabarito.suspeito} + {gameCase.gabarito.descarte}
            </p>
          )}
        </details>

        {!report.modoTreino && (
          <div className="quiz-card">
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.88rem' }}>Enviar à professora:</p>
            {GOOGLE_FORMS_URL && (
              <a
                className="quiz-btn-secondary"
                style={{ display: 'block', textAlign: 'center', marginBottom: '0.5rem', textDecoration: 'none' }}
                href={GOOGLE_FORMS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Google Forms
              </a>
            )}
            <button type="button" className="quiz-btn-secondary" style={{ width: '100%', marginBottom: '0.5rem' }} onClick={copiarCodigo}>
              Copiar código
            </button>
            <button
              type="button"
              className="quiz-btn-secondary"
              style={{ width: '100%' }}
              onClick={() => downloadJson(report, `relatorio-${report.aluno}.json`)}
            >
              Baixar JSON
            </button>
          </div>
        )}

        <motion.button
          type="button"
          className="quiz-btn-primary bit-btn bit-btn--green retro"
          style={{ width: '100%', marginBottom: '0.5rem' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            playClick()
            onPlayAgain()
          }}
        >
          ▶ NEW CASE
        </motion.button>
        <button
          type="button"
          className="quiz-btn-secondary retro"
          style={{ width: '100%' }}
          onClick={() => {
            playClick()
            onMenu()
          }}
        >
          MAIN MENU
        </button>
      </div>
    </>
  )
}
