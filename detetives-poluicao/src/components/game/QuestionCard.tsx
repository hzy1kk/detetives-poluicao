import { useEffect, useState } from 'react'
import { QuizOption } from '../quiz/QuizOption'
import type { BankQuestion } from '../../data/questionBank'
import { shuffleQuestionOptions } from '../../lib/shuffleOptions'
import { playClick, playError, playSuccess } from '../../lib/audio'
import { shouldReduceMotionEffects } from '../../lib/mobile'

type Props = {
  question: BankQuestion
  nivel: number
  total?: number
  shuffleKey: string
  onCorrect: () => void
  onWrong?: (msg: string) => void
}

export function QuestionCard({ question, nivel, total = 5, shuffleKey, onCorrect, onWrong }: Props) {
  const resultMs = shouldReduceMotionEffects() ? 750 : 1200
  const [shuffled, setShuffled] = useState(() => shuffleQuestionOptions(question))
  const [feedback, setFeedback] = useState<string | null>(null)
  const [pickedIdx, setPickedIdx] = useState<number | null>(null)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    setShuffled(shuffleQuestionOptions(question))
    setFeedback(null)
    setPickedIdx(null)
    setResult(null)
    setLocked(false)
  }, [question.id, shuffleKey, question])

  function pick(idx: number) {
    if (locked) return
    playClick()
    setPickedIdx(idx)
    setLocked(true)

    if (shuffled.correta === idx) {
      playSuccess()
      setResult('correct')
      setFeedback(shuffled.pistaOk)
    } else {
      playError()
      setResult('wrong')
      const msg = shuffled.feedbackErro
      setFeedback(msg)
      onWrong?.(msg)
      window.setTimeout(() => {
        setLocked(false)
        setPickedIdx(null)
        setResult(null)
        setFeedback(null)
      }, resultMs)
    }
  }

  function continuar() {
    playClick()
    onCorrect()
  }

  return (
    <div className="quiz-card question-card">
      <p className="question-card__header" id="question-title">
        <span className="retro question-card__tier">Pergunta {nivel} de {total}</span>
      </p>
      <p className="question-card__text">{shuffled.pergunta}</p>
      <div className="quiz-options">
        {shuffled.opcoes.map((op, idx) => (
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
        <div className="question-card__result">
          <p
            className={`quiz-feedback question-card__feedback ${
              result === 'wrong' ? 'quiz-feedback--err' : 'quiz-feedback--ok'
            }`}
            role="status"
          >
            {result === 'correct' ? (
              <>
                <span className="retro question-card__result-label">Pista desbloqueada!</span>
                <br />
                {feedback}
              </>
            ) : (
              feedback
            )}
          </p>
          {result === 'correct' && (
            <button type="button" className="quiz-btn-primary question-card__continue retro" onClick={continuar}>
              CONTINUAR
            </button>
          )}
        </div>
      )}
    </div>
  )
}
