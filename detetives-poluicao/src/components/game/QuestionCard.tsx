import { QuizOption } from '../quiz/QuizOption'
import type { BankQuestion } from '../../data/questionBank'
import { playClick, playError, playSuccess } from '../../lib/audio'

type Props = {
  question: BankQuestion
  nivel: number
  onCorrect: () => void
  onWrong: (msg: string) => void
}

export function QuestionCard({ question, nivel, onCorrect, onWrong }: Props) {
  return (
    <div className="quiz-card question-card">
      <p className="retro question-card__tier">PERGUNTA {nivel}/5 · NIVEL {nivel}</p>
      <p className="question-card__text">{question.pergunta}</p>
      <div className="quiz-options">
        {question.opcoes.map((op, idx) => (
          <QuizOption
            key={op}
            onClick={() => {
              playClick()
              if (question.correta === idx) {
                playSuccess()
                onCorrect()
              } else {
                playError()
                onWrong(question.feedbackErro)
              }
            }}
          >
            <span className="quiz-choice-key">{String.fromCharCode(65 + idx)}</span>
            {op}
          </QuizOption>
        ))}
      </div>
    </div>
  )
}
