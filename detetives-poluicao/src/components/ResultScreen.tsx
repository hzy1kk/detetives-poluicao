import { formatTime } from '../lib/gameEngine'
import { playClick } from '../lib/audio'
import type { GameCase, Report } from '../types'
import { downloadJson } from '../lib/storage'

type Props = {
  report: Report
  gameCase: GameCase
  onMenu: () => void
  onPlayAgain: () => void
}

export function ResultScreen({ report, gameCase, onMenu, onPlayAgain }: Props) {
  const stars = '★'.repeat(report.estrelas) + '☆'.repeat(3 - report.estrelas)

  function copiarCodigo() {
    playClick()
    navigator.clipboard.writeText(report.codigoExport)
  }

  return (
    <section className="card result-card">
      <h2>{report.correto ? '🎉 Caso resolvido!' : '📋 Investigação encerrada'}</h2>
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
        <button
          type="button"
          className="btn-primary btn-block"
          onClick={() => {
            playClick()
            onPlayAgain()
          }}
        >
          Novo caso
        </button>
        <button type="button" className="btn-block" onClick={() => { playClick(); onMenu() }}>
          Menu principal
        </button>
      </div>
    </section>
  )
}
