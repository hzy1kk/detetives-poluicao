import { useMemo, useState } from 'react'
import { SegmentProgress } from './quiz/SegmentProgress'
import { QuizOption } from './quiz/QuizOption'
import {
  getClueCount,
  getErrorHint,
  getHintText,
  getVisibleClueIds,
  formatTime,
} from '../lib/gameEngine'
import { playClick, playError, playReveal, playSuccess, playUnlock } from '../lib/audio'
import { vibrateError, vibrateSuccess } from '../lib/haptics'
import type { GameCase, GameSession } from '../types'

type Props = {
  gameCase: GameCase
  session: GameSession
  tempoSegundos: number
  onUpdateSession: (s: GameSession) => void
  onFinish: (suspeito: string, descarte: string) => void
  onQuit: () => void
}

type GameStep = 'caso' | 'pistas' | 'lab' | 'veredito'

const STEPS: { id: GameStep; title: string }[] = [
  { id: 'caso', title: 'Caso' },
  { id: 'pistas', title: 'Pistas' },
  { id: 'lab', title: 'Laboratório' },
  { id: 'veredito', title: 'Resposta' },
]

const STEP_NUM: Record<GameStep, number> = { caso: 1, pistas: 2, lab: 3, veredito: 4 }

export function GameScreen({
  gameCase,
  session,
  tempoSegundos,
  onUpdateSession,
  onFinish,
  onQuit,
}: Props) {
  const [step, setStep] = useState<GameStep>('caso')
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
  }, [session, totalPistas])

  const proximaClue = proximaPistaId
    ? gameCase.pistas.find((p) => p.id === proximaPistaId)
    : null

  const suspeitosFiltrados = gameCase.suspeitos.filter((s) => !suspeitosOcultos.includes(s))
  const stepNum = STEP_NUM[step]
  const stepTitle = STEPS.find((s) => s.id === step)?.title ?? ''

  function nextStep() {
    const i = STEPS.findIndex((s) => s.id === step)
    if (i < STEPS.length - 1) {
      playClick()
      setStep(STEPS[i + 1].id)
      setFeedback('')
    }
  }

  function prevStep() {
    const i = STEPS.findIndex((s) => s.id === step)
    if (i > 0) {
      playClick()
      setStep(STEPS[i - 1].id)
      setFeedback('')
    }
  }

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
    playReveal()
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
      playReveal()
      vibrateSuccess()
      onUpdateSession({
        ...session,
        miniRespostas: { ...session.miniRespostas, [clueId]: true },
        cluesRevealed: Math.min(session.cluesRevealed + 1, totalPistas),
      })
      setMiniAtiva(null)
      setFeedback('Correto! Pista liberada.')
    } else {
      playError()
      vibrateError()
      setFeedback('Incorreto. Tente outra opção.')
    }
  }

  function pedirDica() {
    if (session.dicasUsadas >= 3) return
    playClick()
    const level = session.dicasUsadas + 1
    onUpdateSession({ ...session, dicasUsadas: level })
    if (level === 3) {
      setSuspeitosOcultos((prev) =>
        prev.includes(gameCase.suspeitoEliminarDica3)
          ? prev
          : [...prev, gameCase.suspeitoEliminarDica3],
      )
    }
    setFeedback(getHintText(gameCase, level))
  }

  function rodarTeste(testId: string, resultado: string) {
    playClick()
    if (session.labCharges <= 0 && !session.testesFeitos.includes(testId)) {
      setFeedback('Sem cargas no laboratório.')
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

  function enviar() {
    playClick()
    const tent = session.tentativas + 1
    const polOk = suspeito === gameCase.gabarito.suspeito
    const descOk = descarte === gameCase.gabarito.descarte
    const ok = polOk && descOk
    onUpdateSession({ ...session, tentativas: tent })
    if (!ok && tent < 3) {
      playError()
      vibrateError()
      const baseMsg =
        !polOk && !descOk
          ? 'Poluente e descarte incorretos.'
          : !polOk
            ? 'Poluente incorreto (50%).'
            : 'Descarte incorreto (50%).'
      setFeedback(`${baseMsg}\n\n${getErrorHint(gameCase, polOk, descOk)}`)
      return
    }
    if (ok) {
      playSuccess()
      vibrateSuccess()
    } else {
      playError()
      vibrateError()
    }
    onFinish(suspeito, descarte)
  }

  return (
    <div className="quiz-shell quiz-shell--game">
      <div className="quiz-back-row">
        <button type="button" className="quiz-back-btn" onClick={onQuit} aria-label="Sair">S</button>
        <div style={{ flex: 1 }}>
          <span className="quiz-pista-chip">
            Tempo de investigação: {formatTime(tempoSegundos)}
          </span>
        </div>
      </div>

      <SegmentProgress
        current={stepNum}
        total={4}
        label={
          <>
            <strong>{String(stepNum).padStart(2, '0')}</strong> {stepTitle}
          </>
        }
      />

      {step === 'caso' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow">Análise do caso</p>
            <h3>{gameCase.nome}</h3>
            <p>{gameCase.intro}</p>
            <p style={{ marginTop: '0.65rem' }}>{gameCase.contexto}</p>
          </div>
          <div className="quiz-stats-row">
            <div className="quiz-stat-box">
              <span>Ambiente</span>
              <strong>{gameCase.cenario === 'agua' ? 'Água' : gameCase.cenario === 'solo' ? 'Solo' : 'Lagoa'}</strong>
            </div>
            <div className="quiz-stat-box">
              <span>Nota</span>
              <strong>50+50</strong>
            </div>
            <div className="quiz-stat-box">
              <span>Pistas</span>
              <strong>{totalPistas}</strong>
            </div>
          </div>
        </>
      )}

      {step === 'pistas' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow">Etapa de evidências</p>
            <h3>Leia as evidências</h3>
            <p>Colete todas as pistas antes de ir ao laboratório.</p>
          </div>
          {pistas.length === 0 ? (
            <div className="quiz-card" style={{ textAlign: 'center', color: 'var(--quiz-text-muted)' }}>
              Toque em Continuar para coletar a primeira pista.
            </div>
          ) : (
            <div className="quiz-options" style={{ marginBottom: '0.5rem' }}>
              {pistas.map((p, i) => (
                <div key={p.id} className="quiz-card" style={{ padding: '0.85rem 1rem' }}>
                  <span className="quiz-pista-chip">Pista {i + 1}</span>
                  <p style={{ margin: '0.35rem 0 0', lineHeight: 1.45 }}>{p.texto}</p>
                </div>
              ))}
            </div>
          )}
          {session.cluesRevealed < totalPistas && (
            <div className="quiz-card">
              {!miniAtiva ? (
                <button type="button" className="quiz-btn-primary" style={{ width: '100%' }} onClick={pedirDesbloqueio}>
                  Coletar pista {visibleIds.length + 1}/{totalPistas}
                </button>
              ) : (
                proximaClue?.miniPergunta && (
                  <>
                    <p style={{ fontWeight: 700, margin: '0 0 0.5rem' }}>Checkpoint de Química</p>
                    <p style={{ margin: '0 0 0.75rem', color: 'var(--quiz-text-muted)' }}>
                      {proximaClue.miniPergunta.pergunta}
                    </p>
                    <div className="quiz-options">
                      {proximaClue.miniPergunta.opcoes.map((op, idx) => (
                        <QuizOption key={op} onClick={() => responderMini(proximaClue.id, idx)}>
                          <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                          {op}
                        </QuizOption>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </>
      )}

      {step === 'lab' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow">Etapa técnica</p>
            <h3>Laboratório do André</h3>
            <p>
              Você tem <strong>{session.labCharges}</strong> carga(s). Cada teste novo gasta 1.
            </p>
          </div>
          <div className="quiz-options">
            {gameCase.testes.map((t) => (
              <QuizOption
                key={t.id}
                selected={session.testesFeitos.includes(t.id)}
                onClick={() => rodarTeste(t.id, t.resultado)}
              >
                {t.nome}
                {session.testesFeitos.includes(t.id) ? ' ✓' : ''}
              </QuizOption>
            ))}
          </div>
          {resultadoLab && (
            <div className="quiz-feedback quiz-feedback--ok lab-result-flash">{resultadoLab}</div>
          )}
        </>
      )}

      {step === 'veredito' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow">Decisão final</p>
            <h3>Qual a conclusão?</h3>
            <p>Poluente e descarte valem 50% da nota cada.</p>
          </div>
          <p style={{ fontWeight: 600, margin: '0 0 0.5rem', fontSize: '0.85rem' }}>Fonte de poluição</p>
          <div className="quiz-options">
            {suspeitosFiltrados.map((s, idx) => (
              <QuizOption key={s} selected={suspeito === s} onClick={() => setSuspeito(s)}>
                <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                {s}
              </QuizOption>
            ))}
          </div>
          <p style={{ fontWeight: 600, margin: '0.75rem 0 0.5rem', fontSize: '0.85rem' }}>Descarte correto</p>
          <div className="quiz-options">
            {gameCase.descartes.map((d, idx) => (
              <QuizOption key={d} selected={descarte === d} onClick={() => setDescarte(d)}>
                <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                {d}
              </QuizOption>
            ))}
          </div>
        </>
      )}

      {feedback && (
        <div
          className={`quiz-feedback ${
            feedback.toLowerCase().includes('incorret') || feedback.includes('Sem cargas')
              ? 'quiz-feedback--err'
              : 'quiz-feedback--ok'
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="quiz-footer-actions">
        {step === 'pistas' && (
          <button type="button" className="quiz-hint-btn quiz-hint-btn--text" onClick={pedirDica} disabled={session.dicasUsadas >= 3} title="Dica">
            Dica
          </button>
        )}
        {step !== 'caso' && step !== 'pistas' && (
          <button type="button" className="quiz-hint-btn quiz-hint-btn--text" onClick={prevStep} title="Voltar">
            Voltar
          </button>
        )}
        <button
          type="button"
          className="quiz-btn-primary"
          disabled={step === 'veredito' ? !suspeito || !descarte : step === 'pistas' ? false : false}
          onClick={() => {
            if (step === 'veredito') enviar()
            else if (step === 'pistas' && session.cluesRevealed < totalPistas) pedirDesbloqueio()
            else nextStep()
          }}
        >
          {step === 'veredito'
            ? 'Enviar resposta'
            : step === 'pistas' && session.cluesRevealed < totalPistas
              ? `Coletar pista (${visibleIds.length}/${totalPistas})`
              : 'Continuar'}
        </button>
      </div>
    </div>
  )
}
