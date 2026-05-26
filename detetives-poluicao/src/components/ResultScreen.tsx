import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '../lib/gameEngine'
import { playClick } from '../lib/audio'
import type { GameCase, Report } from '../types'
import { downloadJson } from '../lib/storage'
import { AnimatedPanel } from './ui/AnimatedPanel'

const CONFETTI_COLORS = ['#00f5d4', '#7b2ff7', '#f72585', '#fee440', '#4cc9f0']

type Props = {
  report: Report
  gameCase: GameCase
  onMenu: () => void
  onPlayAgain: () => void
}

export function ResultScreen({ report, gameCase, onMenu, onPlayAgain }: Props) {
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
    <AnimatedPanel className="card result-card result-card--premium">
      {report.correto && (
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {report.correto ? '🎉 Caso resolvido!' : '📋 Investigação encerrada'}
      </motion.h2>
      <p className="stars">{stars}</p>
      <p className="score">Pontuação: {report.pontuacao}</p>
      <p>Tempo: {formatTime(report.tempoSegundos)}</p>

      <article className="feedback">
        <h3>Resumo rápido</h3>
        <p>
          <strong>Fonte escolhida:</strong> {report.suspeitoEscolhido}
          <br />
          <strong>Ação escolhida:</strong> {report.descarteEscolhido}
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
        {report.poluenteCorreto && !report.descarteCorreto && (
          <p className="dica">Você acertou o poluente, mas errou o descarte (50% do caminho).</p>
        )}
      </article>

      {!report.modoTreino && (
        <div className="export-box">
          <p>Envie para a Profª Maria:</p>
          <button
            type="button"
            className="btn-block"
            onClick={() => downloadJson(report, `relatorio-${report.aluno}.json`)}
          >
            Baixar relatório JSON
          </button>
          <button type="button" className="btn-block" onClick={copiarCodigo}>
            Copiar código para colar
          </button>
          <textarea readOnly value={report.codigoExport} rows={3} className="code-area" />
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
          Menu principal
        </button>
      </div>
    </AnimatedPanel>
  )
}
