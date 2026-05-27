import type { ReactNode } from 'react'

type Props = {
  current: number
  total: number
  label?: ReactNode
}

export function SegmentProgress({ current, total, label }: Props) {
  return (
    <div>
      <div className="quiz-progress-head">
        <span className="quiz-progress-label">
          {label ?? (
            <>
              <strong>{String(current).padStart(2, '0')}</strong> / {String(total).padStart(2, '0')}
            </>
          )}
        </span>
      </div>
      <div className="quiz-segments" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
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
