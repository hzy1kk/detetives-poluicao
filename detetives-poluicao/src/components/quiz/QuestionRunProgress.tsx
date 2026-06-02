type Props = {
  current: number
  total: number
}

export function QuestionRunProgress({ current, total }: Props) {
  return (
    <div className="question-run-progress" aria-label={`Pergunta ${current} de ${total}`}>
      <p className="question-run-progress__label">
        Pergunta <strong>{current}</strong> de {total}
      </p>
      <div className="quiz-segments question-run-progress__segments" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1
          let cls = 'quiz-segment'
          if (n < current) cls += ' quiz-segment--done'
          else if (n === current) cls += ' quiz-segment--active'
          return <div key={n} className={cls} />
        })}
      </div>
    </div>
  )
}
