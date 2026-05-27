import { motion } from 'framer-motion'
import type { StudentProfile } from '../types'
import { playClick } from '../lib/audio'
import { AnimatedPanel } from './ui/AnimatedPanel'
import { CreditsFooter } from './CreditsFooter'

type Props = {
  profile: StudentProfile
  soundOn: boolean
  fontSize: 'p' | 'm' | 'g'
  onPlay: (treino: boolean) => void
  onTeacher: () => void
  onAbout: () => void
  onHistory: () => void
  onRanking: () => void
  onTutorial: () => void
  onToggleSound: () => void
  onFontSize: (s: 'p' | 'm' | 'g') => void
  onLogout: () => void
}

const tiles = [
  { id: 'play', icon: '🎯', title: 'Nova investigação', sub: 'Caso sorteado', primary: true, action: 'play' as const },
  { id: 'treino', icon: '📚', title: 'Modo treino', sub: 'Revisar conteúdo', action: 'treino' as const },
  { id: 'rank', icon: '🏆', title: 'Ranking', sub: 'Melhores notas', action: 'ranking' as const },
  { id: 'hist', icon: '📊', title: 'Histórico', sub: 'Suas partidas', action: 'history' as const },
  { id: 'tut', icon: '❓', title: 'Como jogar', sub: 'Tutorial', action: 'tutorial' as const },
  { id: 'about', icon: 'ℹ️', title: 'Sobre', sub: 'Projeto e BNCC', action: 'about' as const },
  { id: 'docs', icon: '📄', title: 'Documentação', sub: 'PDFs', action: 'docs' as const },
  { id: 'teacher', icon: '👩‍🏫', title: 'Professora', sub: 'Painel de notas', action: 'teacher' as const },
]

export function MenuScreen({
  profile,
  soundOn,
  fontSize,
  onPlay,
  onTeacher,
  onAbout,
  onHistory,
  onRanking,
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
      case 'ranking':
        onRanking()
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
      <AnimatedPanel className="card card--tech" delay={0.05}>
        <div className="menu-hero menu-hero--tech">
          <div className="menu-hero-avatar menu-hero-avatar--tech">🕵️</div>
          <div>
            <h2>Olá, {profile.nome}</h2>
            <p>Pronto para a próxima investigação ambiental?</p>
          </div>
        </div>

        <div className="menu-grid menu-grid--premium">
          {tiles.map((t, i) => (
            <motion.button
              key={t.id}
              type="button"
              className={`menu-tile menu-tile--tech ${t.primary ? 'primary' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
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

        <CreditsFooter />
        <button type="button" className="btn-link" onClick={onLogout}>
          Sair
        </button>
      </AnimatedPanel>
    </div>
  )
}
