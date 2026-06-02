import { useState } from 'react'
import { ChevronLeft, Clock } from 'lucide-react'
import { SegmentProgress } from './quiz/SegmentProgress'
import { QuizOption } from './quiz/QuizOption'
import { CaseMap } from './game/CaseMap'
import { QuestionCard } from './game/QuestionCard'
import {
  getErrorHint,
  getHintText,
  getQuestionsPerRun,
  formatTime,
} from '../lib/gameEngine'
import { getQuestionById } from '../lib/questionPicker'
import { playClick, playError, playSuccess } from '../lib/audio'
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

type GameStep = 'caso' | 'mapa' | 'veredito'

const STEPS: { id: GameStep; title: string }[] = [
  { id: 'caso', title: 'CASO' },
  { id: 'mapa', title: 'MAPA' },
  { id: 'veredito', title: 'VEREDITO' },
]

const STEP_NUM: Record<GameStep, number> = { caso: 1, mapa: 2, veredito: 3 }

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
  const [perguntaAtiva, setPerguntaAtiva] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [ultimaPista, setUltimaPista] = useState('')

  const totalPerguntas = getQuestionsPerRun()
  const indiceAtual = session.cluesRevealed
  const perguntaId = session.perguntaIds[indiceAtual]
  const perguntaAtual = perguntaId ? getQuestionById(perguntaId) : null
  const concluiuPerguntas = session.cluesRevealed >= totalPerguntas

  const pistasColetadas = gameCase.pistas.slice(0, session.cluesRevealed)

  function visitHotspot(hotspotId: string) {
    if (concluiuPerguntas || perguntaAtiva || !perguntaAtual) return

    const allVisited = gameCase.mapaLocais.every((l) => session.locaisVisitados.includes(l.id))
    let locais = session.locaisVisitados
    if (allVisited && session.cluesRevealed < totalPerguntas) locais = []
    if (locais.includes(hotspotId) && !allVisited) return

    onUpdateSession({ ...session, locaisVisitados: [...locais, hotspotId] })
    setPerguntaAtiva(true)
    setFeedback('')
  }

  function onRespostaCerta() {
    if (!perguntaAtual) return
    vibrateSuccess()
    const nextRevealed = session.cluesRevealed + 1
    onUpdateSession({
      ...session,
      cluesRevealed: nextRevealed,
      perguntasAcertos: session.perguntasAcertos + 1,
    })
    setUltimaPista(perguntaAtual.pistaOk)
    setPerguntaAtiva(false)
    setFeedback(perguntaAtual.pistaOk)
  }

  function pedirDica() {
    if (session.dicasUsadas >= 2) return
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

  function irParaMapa() {
    playClick()
    setStep('mapa')
    setFeedback('')
  }

  function irParaVeredito() {
    if (!concluiuPerguntas) {
      setFeedback('Responda as 5 perguntas no mapa primeiro.')
      return
    }
    playClick()
    setStep('veredito')
    setFeedback('')
  }

  const stepNum = STEP_NUM[step]
  const stepTitle = STEPS.find((s) => s.id === step)?.title ?? ''

  return (
    <div className="quiz-shell quiz-shell--game quiz-game-hud">
      <div className="quiz-back-row">
        <button type="button" className="quiz-back-btn" onClick={onQuit} aria-label="Sair">
          <ChevronLeft aria-hidden size={22} strokeWidth={2} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <span className="quiz-timer-pill">
            <Clock aria-hidden size={16} strokeWidth={2} />
            {formatTime(tempoSegundos)}
          </span>
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

      {step === 'caso' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 01</p>
            <h3>{gameCase.nome}</h3>
            <p>{gameCase.intro}</p>
            <p style={{ marginTop: '0.5rem' }}>{gameCase.contexto}</p>
          </div>
        </>
      )}

      {step === 'mapa' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 02</p>
            <h3>Explore o mapa</h3>
            <p>Cada local traz uma pergunta. Dificuldade sobe de 1 a 5.</p>
          </div>

          <CaseMap
            gameCase={gameCase}
            session={session}
            totalPerguntas={totalPerguntas}
            onVisit={visitHotspot}
          />

          {perguntaAtiva && perguntaAtual && (
            <QuestionCard
              question={perguntaAtual}
              nivel={indiceAtual + 1}
              onCorrect={onRespostaCerta}
              onWrong={(msg) => setFeedback(msg)}
            />
          )}

          {pistasColetadas.length > 0 && !perguntaAtiva && (
            <div className="quiz-card" style={{ padding: '0.75rem 1rem' }}>
              <p className="retro" style={{ fontSize: '0.42rem', margin: '0 0 0.35rem' }}>
                PISTAS ({pistasColetadas.length}/{totalPerguntas})
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', fontFamily: 'var(--font-retro)', fontSize: '0.95rem' }}>
                {pistasColetadas.map((p) => (
                  <li key={p.id} style={{ marginBottom: '0.25rem' }}>
                    {p.texto}
                  </li>
                ))}
              </ul>
              {ultimaPista && (
                <p className="quiz-feedback quiz-feedback--ok" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {ultimaPista}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {step === 'veredito' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 03</p>
            <h3>Veredito final</h3>
            <p>50% poluente + 50% descarte.</p>
          </div>
          <p style={{ fontWeight: 600, margin: '0 0 0.5rem', fontSize: '0.85rem' }}>Poluente</p>
          <div className="quiz-options">
            {gameCase.suspeitos.map((s, idx) => (
              <QuizOption key={s} selected={suspeito === s} onClick={() => setSuspeito(s)}>
                <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                {s}
              </QuizOption>
            ))}
          </div>
          <p style={{ fontWeight: 600, margin: '0.75rem 0 0.5rem', fontSize: '0.85rem' }}>Descarte</p>
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
            feedback.toLowerCase().includes('err') ||
            feedback.includes('Responda') ||
            feedback.includes('incorret')
              ? 'quiz-feedback--err'
              : 'quiz-feedback--ok'
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="quiz-footer-actions">
        {step === 'mapa' && (
          <button
            type="button"
            className="quiz-hint-btn quiz-hint-btn--text"
            onClick={pedirDica}
            disabled={session.dicasUsadas >= 2}
          >
            Dica ({2 - session.dicasUsadas})
          </button>
        )}
        <button
          type="button"
          className="quiz-btn-primary"
          disabled={step === 'veredito' ? !suspeito || !descarte : false}
          onClick={() => {
            if (step === 'caso') irParaMapa()
            else if (step === 'mapa') irParaVeredito()
            else enviar()
          }}
        >
          {step === 'caso'
            ? 'IR AO MAPA >>'
            : step === 'mapa'
              ? concluiuPerguntas
                ? 'VEREDITO >>'
                : `PERGUNTAS ${session.cluesRevealed}/${totalPerguntas}`
              : 'ENVIAR'}
        </button>
      </div>
    </div>
  )
}
