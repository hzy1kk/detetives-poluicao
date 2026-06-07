import { useCallback, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { SegmentProgress } from './quiz/SegmentProgress'
import { QuestionRunProgress } from './quiz/QuestionRunProgress'
import { QuizOption } from './quiz/QuizOption'
import { GameTimer } from './game/GameTimer'
import { HintMeter } from './game/HintMeter'
import { ClueBoard } from './game/ClueBoard'
import { MAX_HINTS_PER_RUN } from '../lib/gameEngine'
import { QuestionCard } from './game/QuestionCard'
import {
  getErrorHint,
  getHintText,
  getQuestionsPerRun,
} from '../lib/gameEngine'
import { getQuestionById } from '../lib/questionPicker'
import { playClick, playError, playSuccess } from '../lib/audio'
import { vibrateError, vibrateSuccess } from '../lib/haptics'
import type { GameCase, GameSession } from '../types'

type Props = {
  gameCase: GameCase
  session: GameSession
  onUpdateSession: (s: GameSession) => void
  onFinish: (suspeito: string, descarte: string) => void
  onQuit: () => void
}

type GameStep = 'caso' | 'perguntas' | 'veredito'
type VereditoStep = 'poluente' | 'descarte'

const STEPS: { id: GameStep; title: string }[] = [
  { id: 'caso', title: 'CASO' },
  { id: 'perguntas', title: 'PERGUNTAS' },
  { id: 'veredito', title: 'VEREDITO' },
]

const STEP_NUM: Record<GameStep, number> = { caso: 1, perguntas: 2, veredito: 3 }

export function GameScreen({
  gameCase,
  session,
  onUpdateSession,
  onFinish,
  onQuit,
}: Props) {
  const [step, setStep] = useState<GameStep>('caso')
  const [vereditoStep, setVereditoStep] = useState<VereditoStep>('poluente')
  const [suspeito, setSuspeito] = useState('')
  const [descarte, setDescarte] = useState('')
  const [feedback, setFeedback] = useState('')

  const totalPerguntas = getQuestionsPerRun()
  const indiceAtual = session.cluesRevealed
  const perguntaId = session.perguntaIds[indiceAtual]
  const perguntaAtual = perguntaId ? getQuestionById(perguntaId) : null
  const concluiuPerguntas = session.cluesRevealed >= totalPerguntas
  const perguntaNum = Math.min(indiceAtual + 1, totalPerguntas)

  const pistasColetadas = useMemo(() => {
    return session.perguntaIds
      .slice(0, session.cluesRevealed)
      .map((id) => getQuestionById(id)?.pistaOk)
      .filter((p): p is string => !!p)
  }, [session.perguntaIds, session.cluesRevealed])

  const onRespostaCerta = useCallback(() => {
    if (!perguntaAtual) return
    vibrateSuccess()
    const nextRevealed = session.cluesRevealed + 1
    onUpdateSession({
      ...session,
      cluesRevealed: nextRevealed,
      perguntasAcertos: session.perguntasAcertos + 1,
    })
    setFeedback('')
  }, [perguntaAtual, session, onUpdateSession])

  function pedirDica() {
    if (session.dicasUsadas >= MAX_HINTS_PER_RUN) return
    playClick()
    onUpdateSession({ ...session, dicasUsadas: session.dicasUsadas + 1 })
    setFeedback(getHintText(gameCase, session.dicasUsadas + 1))
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
          ? 'Poluente e descarte errados.'
          : !polOk
            ? 'Poluente errado.'
            : 'Descarte errado.'
      setFeedback(`${baseMsg} ${getErrorHint(gameCase, polOk, descOk)}`)
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

  function irParaPerguntas() {
    playClick()
    setStep('perguntas')
    setFeedback('')
  }

  function irParaVeredito() {
    if (!concluiuPerguntas) {
      setFeedback('Responda as 5 perguntas primeiro.')
      return
    }
    playClick()
    setVereditoStep('poluente')
    setStep('veredito')
    setFeedback('')
  }

  const stepNum = STEP_NUM[step]
  const stepTitle = STEPS.find((s) => s.id === step)?.title ?? ''

  const feedbackIsErr =
    feedback.toLowerCase().includes('err') ||
    feedback.includes('Responda') ||
    feedback.includes('incorret') ||
    feedback.includes('errado')

  return (
    <div className="quiz-shell quiz-shell--game quiz-game-hud">
      <div className="quiz-back-row">
        <button type="button" className="quiz-back-btn" onClick={onQuit} aria-label="Sair">
          <ChevronLeft aria-hidden size={22} strokeWidth={2} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <GameTimer startedAt={session.startedAt} />
        </div>
      </div>

      <SegmentProgress
        current={stepNum}
        total={3}
        label={
          <>
            <strong>{String(stepNum).padStart(2, '0')}</strong> {stepTitle}
          </>
        }
      />

      {step === 'perguntas' && !concluiuPerguntas && (
        <QuestionRunProgress current={perguntaNum} total={totalPerguntas} />
      )}

      {step === 'caso' && (
        <div className="quiz-question-card">
          <p className="quiz-question-eyebrow retro">FASE 01</p>
          <h3>{gameCase.nome}</h3>
          <p className="quiz-instruction">{gameCase.intro}</p>
          <p className="quiz-instruction" style={{ marginTop: '0.5rem' }}>
            {gameCase.contexto}
          </p>
        </div>
      )}

      {step === 'perguntas' && (
        <div className="quiz-run">
          <div className="quiz-question-card quiz-run__banner">
            <p className="quiz-question-eyebrow retro">FASE 02</p>
            <h3>
              {gameCase.emoji} {gameCase.nome}
            </h3>
            <p className="quiz-instruction">
              {concluiuPerguntas
                ? 'Todas as perguntas respondidas! Va ao veredito.'
                : 'Responda as perguntas em ordem. Cada acerto revela uma pista.'}
            </p>
          </div>

          {!concluiuPerguntas && perguntaAtual && (
            <QuestionCard
              question={perguntaAtual}
              nivel={perguntaNum}
              total={totalPerguntas}
              onCorrect={onRespostaCerta}
            />
          )}

          <ClueBoard clues={pistasColetadas} total={totalPerguntas} />
        </div>
      )}

      {step === 'veredito' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 03</p>
            <h3>Veredito final</h3>
            <p className="quiz-instruction">
              {vereditoStep === 'poluente'
                ? 'Passo 1: quem poluiu? Escolha o poluente.'
                : 'Passo 2: qual o descarte correto?'}
            </p>
          </div>

          {vereditoStep === 'poluente' && (
            <>
              <p className="quiz-step-label">Quem poluiu?</p>
              <div className="quiz-options">
                {gameCase.suspeitos.map((s, idx) => (
                  <QuizOption
                    key={s}
                    hideRadio
                    selected={suspeito === s}
                    onClick={() => {
                      playClick()
                      setSuspeito(s)
                    }}
                  >
                    <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                    {s}
                  </QuizOption>
                ))}
              </div>
            </>
          )}

          {vereditoStep === 'descarte' && (
            <>
              <p className="quiz-step-label">Descarte correto</p>
              <div className="quiz-options">
                {gameCase.descartes.map((d, idx) => (
                  <QuizOption
                    key={d}
                    hideRadio
                    selected={descarte === d}
                    onClick={() => {
                      playClick()
                      setDescarte(d)
                    }}
                  >
                    <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                    {d}
                  </QuizOption>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {feedback && (
        <div className={`quiz-feedback ${feedbackIsErr ? 'quiz-feedback--err' : 'quiz-feedback--ok'}`}>
          {feedback}
        </div>
      )}

      <div className={`quiz-footer-actions${step === 'perguntas' && !concluiuPerguntas ? ' quiz-footer-actions--hint-only' : ''}`}>
        {step === 'perguntas' && (
          <HintMeter used={session.dicasUsadas} onUse={pedirDica} />
        )}
        {(step !== 'perguntas' || concluiuPerguntas) && (
          <button
            type="button"
            className="quiz-btn-primary"
            disabled={
              step === 'veredito'
                ? vereditoStep === 'poluente'
                  ? !suspeito
                  : !descarte
                : false
            }
            onClick={() => {
              if (step === 'caso') irParaPerguntas()
              else if (step === 'perguntas') irParaVeredito()
              else if (vereditoStep === 'poluente') {
                if (!suspeito) return
                playClick()
                setVereditoStep('descarte')
                setFeedback('')
              } else enviar()
            }}
          >
            {step === 'caso'
              ? 'IR AS PERGUNTAS'
              : step === 'perguntas'
                ? 'VEREDITO'
                : vereditoStep === 'poluente'
                  ? 'PROXIMO'
                  : 'ENVIAR'}
          </button>
        )}
      </div>
    </div>
  )
}
