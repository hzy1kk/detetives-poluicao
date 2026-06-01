import { useMemo, useState } from 'react'
import { ChevronLeft, Clock } from 'lucide-react'
import { SegmentProgress } from './quiz/SegmentProgress'
import { QuizOption } from './quiz/QuizOption'
import { CaseMap } from './game/CaseMap'
import { CluePuzzle } from './game/CluePuzzle'
import { EvidenceBoard } from './game/EvidenceBoard'
import {
  applyLabTest,
  getActiveSuspeitos,
  getClueCount,
  getErrorHint,
  getHintText,
  getSuspeitoComMaisPistas,
  getVisibleClueIds,
  formatTime,
  isTeoriaAlinhada,
  requiresLabBeforeVerdict,
  requiresTheoryPins,
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

const STEPS: { id: GameStep; title: string; label: string }[] = [
  { id: 'caso', title: 'CASO', label: 'Arquivo' },
  { id: 'pistas', title: 'PISTAS', label: 'Cena' },
  { id: 'lab', title: 'LAB', label: 'Laboratorio' },
  { id: 'veredito', title: 'VEREDITO', label: 'Acusacao' },
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
  const [destacados, setDestacados] = useState<string[]>([])

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

  const suspeitosFiltrados = getActiveSuspeitos(gameCase, session, suspeitosOcultos)
  const stepNum = STEP_NUM[step]
  const stepMeta = STEPS.find((s) => s.id === step)!

  const teoriaTop = getSuspeitoComMaisPistas(gameCase, session)

  function nextStep() {
    const i = STEPS.findIndex((s) => s.id === step)
    if (i < STEPS.length - 1) {
      if (step === 'pistas' && session.cluesRevealed < totalPistas) {
        setFeedback(`Colete todas as ${totalPistas} pistas no mapa antes do laboratorio.`)
        return
      }
      if (step === 'lab' && requiresLabBeforeVerdict(session)) {
        setFeedback('Rode pelo menos 1 teste no laboratorio antes do veredito.')
        return
      }
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

  function visitHotspot(hotspotId: string) {
    if (session.cluesRevealed >= totalPistas) return

    const allVisited = gameCase.mapaLocais.every((l) => session.locaisVisitados.includes(l.id))
    let locais = session.locaisVisitados
    if (allVisited && session.cluesRevealed < totalPistas) {
      locais = []
    }
    if (locais.includes(hotspotId) && !allVisited) return

    const nextLocais = [...locais, hotspotId]
    onUpdateSession({ ...session, locaisVisitados: nextLocais })

    if (!proximaClue) return
    if (proximaClue.miniPergunta && !session.miniRespostas[proximaClue.id]) {
      setMiniAtiva(proximaClue.id)
      return
    }
    unlockNext(nextLocais)
  }

  function unlockNext(locais = session.locaisVisitados) {
    playUnlock()
    playReveal()
    onUpdateSession({
      ...session,
      locaisVisitados: locais,
      cluesRevealed: Math.min(session.cluesRevealed + 1, totalPistas),
    })
    setMiniAtiva(null)
    setFeedback('Nova pista coletada!')
  }

  function onPuzzleSuccess() {
    if (!proximaClue) return
    playSuccess()
    vibrateSuccess()
    onUpdateSession({
      ...session,
      miniRespostas: { ...session.miniRespostas, [proximaClue.id]: true },
      cluesRevealed: Math.min(session.cluesRevealed + 1, totalPistas),
    })
    setMiniAtiva(null)
    setFeedback('Correto! Pista liberada.')
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
      setFeedback('Sem cargas no laboratorio.')
      return
    }
    const { session: next, eliminados, destacados: dest } = applyLabTest(gameCase, session, testId)
    onUpdateSession(next)
    setResultadoLab(resultado)
    if (dest.length) setDestacados((d) => [...new Set([...d, ...dest])])
    if (eliminados.length > 0 && !session.testesFeitos.includes(testId)) {
      setFeedback(`TESTE OK — ${eliminados.length} suspeito(s) eliminado(s).`)
    }
  }

  function enviar() {
    playClick()
    if (requiresLabBeforeVerdict(session)) {
      setFeedback('Faca pelo menos 1 teste no laboratorio.')
      return
    }
    if (requiresTheoryPins(session)) {
      const pins = Object.values(session.pistaSuspeito).filter(Boolean).length
      if (pins > 0 && !isTeoriaAlinhada(gameCase, session, suspeito)) {
        setFeedback('Sua teoria no quadro nao combina com o poluente escolhido. Revise as pistas.')
        return
      }
    }

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

  function handlePrimary() {
    if (step === 'veredito') {
      enviar()
      return
    }
    if (step === 'pistas') {
      if (session.cluesRevealed < totalPistas) {
        setFeedback('Toque em um local do mapa para coletar a proxima pista.')
        return
      }
      nextStep()
      return
    }
    if (step === 'lab' && requiresLabBeforeVerdict(session)) {
      setFeedback('Rode pelo menos 1 teste antes de avancar.')
      return
    }
    nextStep()
  }

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
        total={4}
        label={
          <>
            <strong>{String(stepNum).padStart(2, '0')}</strong> {stepMeta.title} · {stepMeta.label}
          </>
        }
      />

      {step === 'caso' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 01 · DOSSIE</p>
            <h3>{gameCase.nome}</h3>
            <p>{gameCase.intro}</p>
            <p style={{ marginTop: '0.65rem' }}>{gameCase.contexto}</p>
            <p className="quiz-bncc-chip" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              BNCC: {gameCase.bncc.join(' · ')}
            </p>
          </div>
          <div className="quiz-stats-row">
            <div className="quiz-stat-box">
              <span>Ambiente</span>
              <strong>{gameCase.cenario === 'agua' ? 'Agua' : gameCase.cenario === 'solo' ? 'Solo' : 'Lagoa'}</strong>
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
            <p className="quiz-question-eyebrow retro">FASE 02 · CENA</p>
            <h3>Colete evidencias no mapa</h3>
            <p>Explore os locais e monte sua teoria no quadro.</p>
          </div>

          <CaseMap
            gameCase={gameCase}
            session={session}
            totalPistas={totalPistas}
            onVisit={visitHotspot}
          />

          {miniAtiva && proximaClue?.miniPergunta && (
            <div className="quiz-card">
              <CluePuzzle
                puzzle={proximaClue.miniPergunta}
                onSuccess={onPuzzleSuccess}
                onCancel={() => setMiniAtiva(null)}
              />
            </div>
          )}

          {pistas.length > 0 && (
            <div className="quiz-options" style={{ marginBottom: '0.5rem' }}>
              {pistas.map((p, i) => (
                <div key={p.id} className="quiz-card" style={{ padding: '0.85rem 1rem' }}>
                  <span className="quiz-pista-chip">Pista {i + 1}</span>
                  <p style={{ margin: '0.35rem 0 0', lineHeight: 1.45 }}>{p.texto}</p>
                </div>
              ))}
            </div>
          )}

          <EvidenceBoard
            gameCase={gameCase}
            session={session}
            pistas={pistas}
            onUpdateSession={onUpdateSession}
          />
        </>
      )}

      {step === 'lab' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 03 · LABORATORIO</p>
            <h3>Testes do Andre</h3>
            <p>
              Voce tem <strong>{session.labCharges}</strong> carga(s). Cada teste novo elimina hipoteses erradas.
            </p>
          </div>
          <div className="quiz-options">
            {gameCase.testes.map((t) => (
              <QuizOption
                key={t.id}
                selected={session.testesFeitos.includes(t.id)}
                onClick={() => rodarTeste(t.id, `${t.personagem}: ${t.resultado}`)}
              >
                {t.nome}
                {t.testeChave ? ' ★' : ''}
                {session.testesFeitos.includes(t.id) ? ' ✓' : ''}
              </QuizOption>
            ))}
          </div>
          {resultadoLab && (
            <div className="quiz-feedback quiz-feedback--ok lab-result-flash">{resultadoLab}</div>
          )}
          {session.suspeitosEliminadosLab.length > 0 && (
            <p className="quiz-feedback quiz-feedback--ok" style={{ fontSize: '0.9rem' }}>
              Eliminados pelo lab: {session.suspeitosEliminadosLab.length} hipotese(s).
            </p>
          )}
        </>
      )}

      {step === 'veredito' && (
        <>
          <div className="quiz-question-card">
            <p className="quiz-question-eyebrow retro">FASE 04 · VEREDITO</p>
            <h3>Acusacao final</h3>
            <p>Poluente e descarte valem 50% da nota cada.</p>
            {teoriaTop && (
              <p className="quiz-feedback quiz-feedback--ok" style={{ marginTop: '0.5rem' }}>
                Teoria forte no quadro: {teoriaTop.slice(0, 40)}…
              </p>
            )}
          </div>
          <p style={{ fontWeight: 600, margin: '0 0 0.5rem', fontSize: '0.85rem' }}>Fonte de poluicao</p>
          <div className="quiz-options">
            {suspeitosFiltrados.map((s, idx) => (
              <QuizOption
                key={s}
                selected={suspeito === s}
                onClick={() => setSuspeito(s)}
                highlight={destacados.includes(s)}
              >
                <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
                {s}
              </QuizOption>
            ))}
          </div>
          {suspeitosFiltrados.length === 0 && (
            <p className="quiz-feedback quiz-feedback--err">Todos suspeitos eliminados — volte ao lab.</p>
          )}
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
            feedback.toLowerCase().includes('incorret') ||
            feedback.includes('Sem cargas') ||
            feedback.includes('nao combina') ||
            feedback.includes('Colete') ||
            feedback.includes('Toque') ||
            feedback.includes('Rode') ||
            feedback.includes('Faca')
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
            Dica ({3 - session.dicasUsadas})
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
          disabled={step === 'veredito' ? !suspeito || !descarte || suspeitosFiltrados.length === 0 : false}
          onClick={handlePrimary}
        >
          {step === 'veredito'
            ? 'ENVIAR VEREDITO'
            : step === 'pistas'
              ? session.cluesRevealed < totalPistas
                ? `PISTAS ${session.cluesRevealed}/${totalPistas}`
                : 'IR AO LAB >>'
              : step === 'lab'
                ? requiresLabBeforeVerdict(session)
                  ? 'TESTE OBRIGATORIO'
                  : 'VEREDITO >>'
                : 'CONTINUAR >>'}
        </button>
      </div>
    </div>
  )
}
