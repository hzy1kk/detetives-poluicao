import type { ReactNode } from 'react'

type Props = {
  open: boolean
  children: ReactNode
  onDismiss?: () => void
  allowDismiss?: boolean
}

export function QuestionOverlay({ open, children, onDismiss, allowDismiss = false }: Props) {
  if (!open) return null

  return (
    <div className="question-overlay" role="dialog" aria-modal="true" aria-labelledby="question-overlay-title">
      <div className="question-overlay__backdrop" aria-hidden />
      <div className="question-overlay__panel bit-box">
        {allowDismiss && onDismiss && (
          <button
            type="button"
            className="question-overlay__close quiz-btn-ghost retro"
            onClick={onDismiss}
            aria-label="Fechar"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
