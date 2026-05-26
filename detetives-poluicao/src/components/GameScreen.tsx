import { useMemo, useState } from 'react'
import { getClueCount, getHintText, getVisibleClueIds, formatTime } from '../lib/gameEngine'
import { playClick, playError, playSuccess, playUnlock } from '../lib/audio'
import type { GameCase, GameSession } from '../types'

type Props = {
  gameCase: GameCase
  session: GameSession
  tempoSegundos: number
  onUpdateSession: (s: GameSession) => void
  onFinish: (suspeito: string, descarte: string) => void
  onQuit: () => void
}

export function GameScreen({
  gameCase,
  session,
  tempoSegundos,
  onUpdateSession,
  onFinish,
  onQuit,
}: Props) {
  const [suspeito, setSuspeito] = useState('')
  const [descarte, setDescarte] = useState('')
  const [resultadoLab, setResultadoLab] = useState('')
  const [miniAtiva, setMiniAtiva] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [suspeitosOcultos, setSuspeitosOcultos] = useState<string[]>([])

  const totalPistas = getClueCount(session.difficulty)
  const visibleIds = getVisibleClueIds(session, gameCase)
  const pistas = visibleIds
    .map((id) => gameCase.pistas.find((p) => p.id === id))
    .filter(Boolean) as typeof gameCase.pistas

  const proximaPistaId = useMemo(() => {
    if (session.cluesRevealed >= totalPistas) return null
    return session.clueOrder[session.cluesRevealed] ?? null
  }, [session, totalPistas, gameCase])

  const proximaClue = proximaPistaId
    ? gameCase.pistas.find((p) => p.id === proximaPistaId)
    : null

  function pedirDesbloqueio() {
    playClick()
    if (!proximaClue) return
    if (proximaClue.miniPergunta && !session.miniRespostas[proximaClue.id]) {
      setMiniAtiva(proximaClue.id)
      return
    }
    unlockNext()
  }

  function unlockNext() {
    playUnlock()
    onUpdateSession({
      ...session,
      cluesRevealed: Math.min(session.cluesRevealed + 1, totalPistas),
    })
    setMiniAtiva(null)
    setFeedback('Nova pista desbloqueada!')
  }

  function responderMini(clueId: string, idx: number) {
    const clue = gameCase.pistas.find((p) => p.id === clueId)
    if (!clue?.miniPergunta) return
    const ok = clue.miniPergunta.correta === idx
    if (ok) {
      playSuccess()
      onUpdateSession({
        ...session,
        miniRespostas: { ...session.miniRespostas, [clueId]: true },
        cluesRevealed: Math.min(session.cluesRevealed + 1, totalPistas),
      })
      setMiniAtiva(null)
      setFeedback('Resposta correta! Pista liberada.')
    } else {
      playError()
      setFeedback('Resposta incorreta. Tente outra alternativa.')
    }
  }

  function pedirDica() {
    if (session.dicasUsadas >= 3) return
    playClick()
    const level = session.dicasUsadas + 1
    const next: GameSession = { ...session, dicasUsadas: level }
    onUpdateSession(next)
    if (level === 3) {
      setSuspeitosOcultos((prev) =>
        prev.includes(gameCase.suspeitoEliminarDica3)
          ? prev
          : [...prev, gameCase.suspeitoEliminarDica3],
      )
    }
  }

  function rodarTeste(testId: string, resultado: string) {
    playClick()
    if (session.labCharges <= 0 && !session.testesFeitos.includes(testId)) {
      setFeedback('Sem cargas de laboratório. Priorize os testes mais importantes.')
      return
    }
    const jaFeito = session.testesFeitos.includes(testId)
    onUpdateSession({
      ...session,
      testesFeitos: jaFeito ? session.testesFeitos : [...session.testesFeitos, testId],
      labCharges: jaFeito ? session.labCharges : session.labCharges - 1,
    })
    setResultadoLab(resultado)
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    const tent = session.tentativas + 1
    const polOk = suspeito === gameCase.gabarito.suspeito
    const descOk = descarte === gameCase.gabarito.descarte
    const ok = polOk && descOk
    onUpdateSession({ ...session, tentativas: tent })
    if (!ok && tent < 3) {
      playError()
      setFeedback(
        !polOk && !descOk
          ? 'Poluente e descarte incorretos. Use pistas e laboratório.'
          : !polOk
            ? 'Poluente incorreto. Descarte estava no caminho.'
            : 'Descarte incorreto. Poluente estava certo.',
      )
      return
    }
    if (ok) playSuccess()
    else playError()
    onFinish(suspeito, descarte)
  }

  const suspeitosFiltrados = gameCase.suspeitos.filter((s) => !suspeitosOcultos.includes(s))

  const progresso = Math.round((visibleIds.length / totalPistas) * 100)

  return (
    <section className="card game-card">
      <div className="game-hud" role="status" aria-live="polite">
        <div className="hud-top">
          <span className="hud-emoji" aria-hidden>
            {gameCase.emoji}
          </span>
          <div className="hud-title-wrap">
            <p className="hud-kicker">Caso em andamento</p>
            <strong className="hud-title">{gameCase.nome}</strong>
          </div>
          <span className="badge tempo hud-time">⏱ {formatTime(tempoSegundos)}</span>
        </div>
        {session.modoTreino && <span className="badge treino hud-treino">Modo treino</span>}
        <div className="progress-bar hud-progress" aria-hidden>
          <div className="progress-fill" style={{ width: `${progresso}%` }} />
        </div>
        <div className="hud-stats">
          <span className="stat-chip">
            <b>{visibleIds.length}</b>/{totalPistas} pistas
          </span>
          <span className="stat-chip">
            <b>{session.labCharges}</b> testes
          </span>
          <span className="stat-chip">
            <b>{session.tentativas}</b>/3 tentativas
          </span>
        </div>
      </div>

      <p className="speech-bubble">{gameCase.intro}</p>
      <p className="contexto">{gameCase.contexto}</p>
      <div className="quick-facts">
        <div>
          <span className="q-label">Ambiente</span>
          <strong>{gameCase.cenario === 'agua' ? 'Água' : gameCase.cenario === 'solo' ? 'Solo' : 'Lagoa'}</strong>
        </div>
        <div>
          <span className="q-label">Missão</span>
          <strong>Encontrar poluente + descarte correto</strong>
        </div>
        <div>
          <span className="q-label">Meta de tempo</span>
          <strong>10 minutos</strong>
        </div>
      </div>

      <h3>🔎 Dados coletados</h3>
      <ul className="pistas">
        {pistas.map((p, i) => (
          <li key={p.id} className="pista-item">
            <span className="pista-num">{i + 1}</span>
            {p.texto}
          </li>
        ))}
      </ul>

      {session.cluesRevealed < totalPistas && (
        <div className="unlock-box">
          {!miniAtiva ? (
            <button type="button" className="btn-secondary btn-block" onClick={pedirDesbloqueio}>
              Coletar próxima pista
            </button>
          ) : (
            proximaClue?.miniPergunta && (
              <div className="mini-quiz">
                <p className="quiz-title">Checkpoint rápido de Química</p>
                <p>{proximaClue.miniPergunta.pergunta}</p>
                {proximaClue.miniPergunta.opcoes.map((op, idx) => (
                  <button
                    key={op}
                    type="button"
                    className="btn-option"
                    onClick={() => responderMini(proximaClue.id, idx)}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}

      <div className="acoes acoes-stack">
        <button
          type="button"
          className="btn-block"
          onClick={pedirDica}
          disabled={session.dicasUsadas >= 3}
        >
          Pedir dica estratégica ({session.dicasUsadas}/3)
        </button>
      </div>
      {session.dicasUsadas > 0 && (
        <p className="dica">{getHintText(gameCase, session.dicasUsadas)}</p>
      )}

      <h3>🧪 Laboratório do André</h3>
      <div className="acoes lab acoes-stack">
        {gameCase.testes.map((t) => (
          <button
            key={t.id}
            type="button"
            className="btn-block"
            onClick={() => rodarTeste(t.id, t.resultado)}
          >
            {t.nome}
            {session.testesFeitos.includes(t.id) ? ' ✓' : ''}
          </button>
        ))}
      </div>
      {resultadoLab && <p className="resultado">{resultadoLab}</p>}

      <h3>⚖️ Conclusão da investigação</h3>
      <form onSubmit={enviar} className="grid">
        <label>
          Qual é a principal fonte de poluição?
          <select value={suspeito} onChange={(e) => setSuspeito(e.target.value)} required>
            <option value="">Selecione...</option>
            {suspeitosFiltrados.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Qual é a ação correta de descarte/tratamento?
          <select value={descarte} onChange={(e) => setDescarte(e.target.value)} required>
            <option value="">Selecione...</option>
            {gameCase.descartes.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary btn-block btn-sticky-submit">
          Confirmar resposta final
        </button>
      </form>

      {feedback && (
        <p className={`feedback-banner ${feedback.includes('incorret') ? 'erro' : 'ok-msg'}`}>
          {feedback}
        </p>
      )}

      <button type="button" className="btn-link btn-block-touch" onClick={onQuit}>
        Voltar ao menu
      </button>
    </section>
  )
}
