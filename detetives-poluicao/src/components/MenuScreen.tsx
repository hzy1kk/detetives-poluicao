import { useMemo, useState } from 'react'
import type { Screen, StudentProfile } from '../types'
import { playClick } from '../lib/audio'
import { getCaseBadges, getCaseProgressLabel } from '../lib/caseProgress'
import { loadReports, normalizeReport } from '../lib/storage'
import { QuizLayout } from './quiz/QuizLayout'
import { CreditsFooter } from './CreditsFooter'
import { PwaInstallBanner } from './PwaInstallBanner'

type Props = {
  profile: StudentProfile
  fontSize: 'p' | 'm' | 'g'
  onPlay: (treino: boolean) => void
  onTeacher: () => void
  onHistory: () => void
  onNavigate: (screen: Screen) => void
  onFontSize: (s: 'p' | 'm' | 'g') => void
  onLogout: () => void
}

type MenuEntry = {
  id: string
  label: string
  action: () => void
}

export function MenuScreen({
  profile,
  fontSize,
  onPlay,
  onTeacher,
  onHistory,
  onNavigate,
  onFontSize,
  onLogout,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const stats = useMemo(() => {
    const mine = loadReports()
      .map(normalizeReport)
      .filter((r) => r.aluno === profile.nome && !r.modoTreino)
    const last = mine.at(-1)
    const media =
      mine.length > 0
        ? Math.round(mine.reduce((s, r) => s + r.notaTotal, 0) / mine.length)
        : null
    return { partidas: mine.length, ultima: last?.notaTotal ?? null, media }
  }, [profile.nome])

  const caseProgress = getCaseProgressLabel(profile.nome)
  const badges = getCaseBadges(profile.nome)

  const menuItems: MenuEntry[] = [
    { id: 'start', label: 'NOVA INVESTIGACAO', action: () => onPlay(false) },
    { id: 'train', label: 'MODO TREINO', action: () => onPlay(true) },
    { id: 'rank', label: 'RANKING', action: () => onNavigate('ranking') },
    { id: 'hist', label: 'HISTORICO', action: onHistory },
    { id: 'learn', label: 'COMO JOGAR', action: () => onNavigate('tutorial') },
    { id: 'docs', label: 'DOCUMENTOS', action: () => window.open('/docs/index.html', '_blank') },
    { id: 'teacher', label: 'PROFESSORA', action: onTeacher },
  ]

  function runItem(index: number) {
    playClick()
    menuItems[index]?.action()
  }

  return (
    <QuizLayout profile={profile} points={stats.ultima} activeNav="menu" onNavigate={onNavigate}>
      <div className="bit-menu-screen">
        <div className="bit-menu-card bit-box bit-box--blue">
          <p className="bit-subtitle retro">Quimica Ambiental</p>
          <h1 className="bit-title retro">DETETIVES</h1>
          <h1 className="bit-title retro" style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
            DA POLUICAO
          </h1>
          <p className="bit-tagline">
            Ola, {profile.nome.split(' ')[0]}! Casos resolvidos: {caseProgress}
          </p>

          <div className="case-badges-row">
            {badges.map((b) => (
              <span
                key={b.id}
                className={`case-badge${b.done ? ' case-badge--done' : ''}`}
                title={b.nome}
              >
                {b.emoji}
              </span>
            ))}
          </div>

          <ul className="bit-menu-list" role="menu">
            {menuItems.map((item, i) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={`bit-menu-item retro${activeIndex === i ? ' bit-menu-item--active' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  onClick={() => runItem(i)}
                >
                  {activeIndex === i && (
                    <span className="bit-menu-item__arrow" aria-hidden>
                      ▶
                    </span>
                  )}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {stats.partidas > 0 && (
          <div className="bit-hud-stats">
            <div className="bit-stat retro">
              <span>PLAYS</span>
              {stats.partidas}
            </div>
            <div className="bit-stat retro">
              <span>LAST</span>
              {stats.ultima ?? '--'}
            </div>
            <div className="bit-stat retro">
              <span>AVG</span>
              {stats.media ?? '--'}
            </div>
          </div>
        )}

        <div className="bit-box" style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
          <p className="quiz-settings-label retro" style={{ margin: '0 0 0.5rem', fontSize: '0.45rem' }}>
            FONT SIZE
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['p', 'm', 'g'] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={`bit-menu-item retro${fontSize === s ? ' bit-menu-item--active' : ''}`}
                style={{ flex: 1, textAlign: 'center', padding: '0.5rem' }}
                onClick={() => {
                  playClick()
                  onFontSize(s)
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <PwaInstallBanner />
        <CreditsFooter />
        <button type="button" className="quiz-btn-ghost retro" style={{ width: '100%' }} onClick={onLogout}>
          SAIR
        </button>
      </div>
    </QuizLayout>
  )
}
