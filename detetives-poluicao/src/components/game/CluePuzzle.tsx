import { useState } from 'react'
import { QuizOption } from '../quiz/QuizOption'
import type { MiniPergunta } from '../../types'
import { playClick, playError, playSuccess } from '../../lib/audio'

type Props = {
  puzzle: MiniPergunta
  onSuccess: () => void
  onCancel?: () => void
}

export function CluePuzzle({ puzzle, onSuccess, onCancel }: Props) {
  if (puzzle.tipo === 'escolha') {
    return <EscolhaPuzzle puzzle={puzzle} onSuccess={onSuccess} />
  }
  if (puzzle.tipo === 'parear') {
    return <ParearPuzzle puzzle={puzzle} onSuccess={onSuccess} onCancel={onCancel} />
  }
  return <OrdenarPuzzle puzzle={puzzle} onSuccess={onSuccess} />
}

function EscolhaPuzzle({
  puzzle,
  onSuccess,
}: {
  puzzle: Extract<MiniPergunta, { tipo: 'escolha' }>
  onSuccess: () => void
}) {
  return (
    <>
      <p style={{ fontWeight: 700, margin: '0 0 0.5rem' }} className="retro">
        PERGUNTA RAPIDA
      </p>
      <p className="quiz-instruction" style={{ margin: '0 0 0.75rem' }}>
        {puzzle.pergunta}
      </p>
      <div className="quiz-options">
        {puzzle.opcoes.map((op, idx) => (
          <QuizOption
            key={op}
            hideRadio
            onClick={() => {
              playClick()
              if (puzzle.correta === idx) {
                playSuccess()
                onSuccess()
              } else {
                playError()
              }
            }}
          >
            <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
            {op}
          </QuizOption>
        ))}
      </div>
    </>
  )
}

function ParearPuzzle({
  puzzle,
  onSuccess,
  onCancel,
}: {
  puzzle: Extract<MiniPergunta, { tipo: 'parear' }>
  onSuccess: () => void
  onCancel?: () => void
}) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState(false)

  const rights = puzzle.pares.map((p) => p.direita)

  function pickRight(idx: number) {
    if (selectedLeft === null || matched.has(selectedLeft)) return
    playClick()
    const pair = puzzle.pares[selectedLeft]
    if (rights[idx] === pair.direita) {
      playSuccess()
      const next = new Set(matched)
      next.add(selectedLeft)
      setMatched(next)
      setSelectedLeft(null)
      setWrong(false)
      if (next.size === puzzle.pares.length) onSuccess()
    } else {
      playError()
      setWrong(true)
      setSelectedLeft(null)
    }
  }

  return (
    <>
      <p className="retro" style={{ fontSize: '0.45rem', margin: '0 0 0.35rem' }}>
        LIGUE AS PISTAS
      </p>
      <p className="quiz-instruction" style={{ margin: '0 0 0.75rem' }}>
        {puzzle.pergunta}
      </p>
      <div className="clue-parear-grid">
        <div>
          <p className="clue-parear-label retro">SINAIS</p>
          {puzzle.pares.map((p, i) => (
            <button
              key={p.esquerda}
              type="button"
              className={`clue-parear-btn${selectedLeft === i ? ' clue-parear-btn--active' : ''}${matched.has(i) ? ' clue-parear-btn--done' : ''}`}
              disabled={matched.has(i)}
              onClick={() => {
                playClick()
                setSelectedLeft(i)
                setWrong(false)
              }}
            >
              {p.esquerda}
            </button>
          ))}
        </div>
        <div>
          <p className="clue-parear-label retro">HIPOTESES</p>
          {rights.map((r, i) => (
            <button
              key={r}
              type="button"
              className="clue-parear-btn"
              onClick={() => pickRight(i)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {wrong && <p className="quiz-feedback quiz-feedback--err">Par incorreto. Tente de novo.</p>}
      {onCancel && (
        <button type="button" className="quiz-btn-ghost retro" style={{ marginTop: '0.5rem' }} onClick={onCancel}>
          Voltar
        </button>
      )}
    </>
  )
}

function OrdenarPuzzle({
  puzzle,
  onSuccess,
}: {
  puzzle: Extract<MiniPergunta, { tipo: 'ordenar' }>
  onSuccess: () => void
}) {
  const [order, setOrder] = useState(puzzle.itens.map((_, i) => i))

  function move(idx: number, dir: -1 | 1) {
    playClick()
    const j = idx + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setOrder(next)
  }

  function check() {
    playClick()
    const ok = order.every((v, i) => v === puzzle.ordemCorreta[i])
    if (ok) {
      playSuccess()
      onSuccess()
    } else {
      playError()
    }
  }

  return (
    <>
      <p className="retro" style={{ fontSize: '0.45rem' }}>
        ORDEM CORRETA
      </p>
      <p className="quiz-instruction" style={{ margin: '0 0 0.75rem' }}>
        {puzzle.pergunta}
      </p>
      {order.map((itemIdx, pos) => (
        <div key={itemIdx} className="clue-ordenar-row">
          <span>{pos + 1}.</span>
          <span style={{ flex: 1 }}>{puzzle.itens[itemIdx]}</span>
          <button type="button" className="quiz-hint-btn" onClick={() => move(pos, -1)} aria-label="Subir">
            ▲
          </button>
          <button type="button" className="quiz-hint-btn" onClick={() => move(pos, 1)} aria-label="Descer">
            ▼
          </button>
        </div>
      ))}
      <button type="button" className="quiz-btn-primary bit-btn retro" style={{ width: '100%', marginTop: '0.5rem' }} onClick={check}>
        Confirmar ordem
      </button>
    </>
  )
}
