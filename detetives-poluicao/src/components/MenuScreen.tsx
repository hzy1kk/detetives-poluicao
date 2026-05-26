import { motion } from 'framer-motion'
import { AUTHORS } from '../data/config'
import type { StudentProfile } from '../types'
import { playClick } from '../lib/audio'
import { AnimatedPanel } from './ui/AnimatedPanel'

type Props = {
  profile: StudentProfile
  soundOn: boolean
  fontSize: 'p' | 'm' | 'g'
  onPlay: (treino: boolean) => void
  onTeacher: () => void
  onAbout: () => void
  onHistory: () => void
  onTutorial: () => void
  onToggleSound: () => void
  onFontSize: (s: 'p' | 'm' | 'g') => void
  onLogout: () => void
}

const tiles = [
  {
    id: 'play',
    icon: '🎯',
    title: 'Nova investigação',
    sub: 'Caso sorteado · valendo nota',
    primary: true,
    action: 'play' as const,
  },
  {
    id: 'treino',
    icon: '📚',
    title: 'Modo treino',
    sub: 'Sem pressão · revisar',
    action: 'treino' as const,
  },
  { id: 'hist', icon: '📊', title: 'Meu histórico', sub: 'Partidas anteriores', action: 'history' as const },
  { id: 'tut', icon: '❓', title: 'Como jogar', sub: 'Tutorial rápido', action: 'tutorial' as const },
  { id: 'about', icon: 'ℹ️', title: 'Sobre o projeto', sub: 'Equipe e BNCC', action: 'about' as const },
  { id: 'docs', icon: '📄', title: 'Documentação PDF', sub: 'Manuais e relatórios', action: 'docs' as const },
  { id: 'teacher', icon: '👩‍🏫', title: 'Área da professora', sub: 'PIN e relatórios', action: 'teacher' as const },
]

export function MenuScreen({
  profile,
  soundOn,
  fontSize,
  onPlay,
  onTeacher,
  onAbout,
  onHistory,
  onTutorial,
  onToggleSound,
  onFontSize,
  onLogout,
}: Props) {
  function handleTile(action: (typeof tiles)[number]['action']) {
    playClick()
    switch (action) {
      case 'play':
        onPlay(false)
        break
      case 'treino':
        onPlay(true)
        break
      case 'history':
        onHistory()
        break
      case 'tutorial':
        onTutorial()
        break
      case 'about':
        onAbout()
        break
      case 'teacher':
        onTeacher()
        break
      case 'docs':
        window.open('/docs/index.html', '_blank', 'noopener,noreferrer')
        break
    }
  }

  return (
    <div className="menu-stage">
      <AnimatedPanel className="card card--glass" delay={0.05}>
        <div className="menu-hero">
          <div className="menu-hero-avatar">🕵️</div>
          <div>
            <h2>Olá, {profile.nome}!</h2>
            <p>
              Turma <strong>{profile.turma}</strong> · Detetive Lucas aguarda sua próxima missão
            </p>
          </div>
        </div>

        <div className="menu-grid menu-grid--premium">
          {tiles.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              className={`menu-tile menu-tile--premium ${t.primary ? 'primary' : ''}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTile(t.action)}
            >
              <span className="tile-icon">{t.icon}</span>
              {t.title}
              <small>{t.sub}</small>
            </motion.button>
          ))}
        </div>

        <div className="prefs">
          <label className="toggle">
            <input type="checkbox" checked={soundOn} onChange={onToggleSound} />
            Som {soundOn ? 'ligado' : 'desligado'}
          </label>
          <div className="font-btns">
            Fonte:
            {(['p', 'm', 'g'] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={fontSize === s ? 'active' : ''}
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

        <p className="creditos-mini">
          Idealizado por {AUTHORS.find((a) => a.destaque)?.nome} e equipe · Turma {profile.turma}
        </p>
        <button type="button" className="btn-link" onClick={onLogout}>
          Sair
        </button>
      </AnimatedPanel>
    </div>
  )
}
