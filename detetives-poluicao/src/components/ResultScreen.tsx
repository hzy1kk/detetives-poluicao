import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatTime } from '../lib/gameEngine'
import { playClick } from '../lib/audio'
import type { GameCase, Report } from '../types'
import { downloadJson } from '../lib/storage'
import { GOOGLE_FORMS_URL } from '../data/config'
import { AnimatedPanel } from './ui/AnimatedPanel'
import { CelebrationScene } from './scene/CelebrationScene'

const CONFETTI_COLORS = ['#00f5d4', '#7b2ff7', '#f72585', '#fee440', '#4cc9f0']

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
      Array.from({ length: 24 }, (_, i) => ({
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

      <AnimatedPanel className="card result-card result-card--premium">
        {report.correto && !showCelebration && (
          <div className="confetti-burst" aria-hidden>
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

        <motion.h2
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {report.correto ? '🎉 Caso resolvido!' : '📋 Investigação encerrada'}
        </motion.h2>
        <p className="stars">{stars}</p>

        <div className="nota-50-grid">
          <div className={`nota-box ${report.poluenteCorreto ? 'ok' : 'fail'}`}>
            <span className="nota-label">Poluente (50%)</span>
            <strong>{report.notaPoluente}/50</strong>
          </div>
          <div className={`nota-box ${report.descarteCorreto ? 'ok' : 'fail'}`}>
            <span className="nota-label">Descarte (50%)</span>
            <strong>{report.notaDescarte}/50</strong>
          </div>
          <div className="nota-box nota-box--total">
            <span className="nota-label">Nota mensal</span>
            <strong>{report.notaTotal}/100</strong>
          </div>
        </div>

        <p>Tempo: {formatTime(report.tempoSegundos)} · Pontos: {report.pontuacao}</p>

        <article className="feedback">
          <h3>Para os 10 min de explicação em sala</h3>
          <ol className="aprendizados-list">
            {gameCase.aprendizados.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
          <h3>Resumo da investigação</h3>
          <p>
            <strong>Fonte:</strong> {report.suspeitoEscolhido}
            <br />
            <strong>Descarte:</strong> {report.descarteEscolhido}
          </p>
          <h3>Explicação química</h3>
          <p>{gameCase.explicacao}</p>
          <p className="bncc">
            <strong>BNCC:</strong> {gameCase.bncc.join(', ')} — {gameCase.bnccTexto}
          </p>
          {!report.correto && (
            <p>
              <strong>Gabarito:</strong> {gameCase.gabarito.suspeito} + {gameCase.gabarito.descarte}
            </p>
          )}
        </article>

        {!report.modoTreino && (
          <div className="export-box">
            <p>Envie para a Profª Maria (ou use o Forms da turma):</p>
            {GOOGLE_FORMS_URL && (
              <a className="btn-secondary btn-block" href={GOOGLE_FORMS_URL} target="_blank" rel="noreferrer">
                Abrir Google Forms
              </a>
            )}
            <button
              type="button"
              className="btn-block"
              onClick={() => downloadJson(report, `relatorio-${report.aluno}.json`)}
            >
              Baixar relatório (opcional)
            </button>
            <button type="button" className="btn-block" onClick={copiarCodigo}>
              Copiar código
            </button>
          </div>
        )}

        <div className="acoes acoes-stack">
          <motion.button
            type="button"
            className="btn-fusion btn-block"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClick()
              onPlayAgain()
            }}
          >
            Novo caso
          </motion.button>
          <button type="button" className="btn-block" onClick={() => { playClick(); onMenu() }}>
            Menu · ver ranking
          </button>
        </div>
      </AnimatedPanel>
    </>
  )
}
