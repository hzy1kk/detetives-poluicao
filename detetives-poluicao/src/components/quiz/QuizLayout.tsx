import type { ReactNode } from 'react'
import type { Screen, StudentProfile } from '../../types'
import { QuizBottomNav, type QuizNavId } from './QuizBottomNav'
import { QuizTopBar } from './QuizTopBar'

type Props = {
  children: ReactNode
  profile?: StudentProfile
  points?: number | null
  showTopBar?: boolean
  showBottomNav?: boolean
  activeNav?: QuizNavId
  onNavigate?: (screen: Screen) => void
  variant?: 'default' | 'game' | 'none'
}

export function QuizLayout({
  children,
  profile,
  points,
  showTopBar = true,
  showBottomNav = true,
  activeNav = 'menu',
  onNavigate,
  variant = 'default',
}: Props) {
  const shellClass =
    variant === 'game'
      ? 'quiz-shell quiz-shell--game'
      : showBottomNav
        ? 'quiz-shell'
        : 'quiz-shell quiz-shell--no-nav'

  return (
    <>
      <div className={shellClass}>
        {showTopBar && profile && <QuizTopBar profile={profile} points={points} />}
        {children}
      </div>
      {showBottomNav && onNavigate && (
        <QuizBottomNav active={activeNav} onNavigate={onNavigate} />
      )}
    </>
  )
}
