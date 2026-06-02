import { useEffect, useState } from 'react'
import { QuizOption } from '../quiz/QuizOption'
import type { BankQuestion } from '../../data/questionBank'
import { playClick, playError, playSuccess } from '../../lib/audio'

type Props = {
  question: BankQuestion
  nivel: number
  total?: number
  onCorrect: () => void
  onWrong?: (msg: string) => void
}

const RESULT_MS = 1200

export function QuestionCard({ question, nivel, total = 5, onCorrect, onWrong }: Props) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [pickedIdx, setPickedIdx] = useState<number | null>(null)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    setFeedback(null)
    setPickedIdx(null)
    setResult(null)
    setLocked(false)
  }, [question.id])

  useEffect(() => {
    if (result !== 'correct') return
    const t = window.setTimeout(() => {
      onCorrect()
    }, RESULT_MS)
    return () => window.clearTimeout(t)
  }, [result, onCorrect])

  function pick(idx: number) {
    if (locked) return
    playClick()
    setPickedIdx(idx)
    setLocked(true)

    if (question.correta === idx) {
      playSuccess()
      setResult('correct')
      setFeedback('Pista desbloqueada!')
    } else {
      playError()
      setResult('wrong')
      const msg = question.feedbackErro
      setFeedback(msg)
      onWrong?.(msg)
      window.setTimeout(() => {
        setLocked(false)
        setPickedIdx(null)
        setResult(null)
        setFeedback(null)
      }, RESULT_MS)
    }
  }

  return (
    <div className="quiz-card question-card">
      <p className="question-card__header" id="question-overlay-title">
        <span className="retro question-card__tier">Pergunta {nivel} de {total}</span>
        <span className="question-card__badge">Dificuldade {nivel}</span>
      </p>
      <p className="question-card__text">{question.pergunta}</p>
      <div className="quiz-options">
        {question.opcoes.map((op, idx) => (
          <QuizOption
            key={op}
            hideRadio
            disabled={locked && result === 'correct'}
            selected={pickedIdx === idx && result !== 'wrong'}
            status={pickedIdx === idx ? result ?? undefined : undefined}
            onClick={() => pick(idx)}
          >
            <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
            {op}
          </QuizOption>
        ))}
      </div>
      {feedback && (
        <p
          className={`quiz-feedback question-card__feedback ${
            result === 'wrong' ? 'quiz-feedback--err' : 'quiz-feedback--ok'
          }`}
          role="status"
        >
          {feedback}
        </p>
      )}
    </div>
  )
}
