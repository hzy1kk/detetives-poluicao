import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, FileText, GraduationCap, History, Play, Search } from 'lucide-react'
import type { Screen, StudentProfile } from '../types'
import { playClick } from '../lib/audio'
import { loadReports, normalizeReport } from '../lib/storage'
import { QuizLayout } from './quiz/QuizLayout'
import { CreditsFooter } from './CreditsFooter'

type Props = {
  profile: StudentProfile
  soundOn: boolean
  fontSize: 'p' | 'm' | 'g'
  onPlay: (treino: boolean) => void
  onTeacher: () => void
  onHistory: () => void
  onNavigate: (screen: Screen) => void
  onToggleSound: () => void
  onFontSize: (s: 'p' | 'm' | 'g') => void
  onLogout: () => void
}

const tileMotion = { whileTap: { scale: 0.97 } }

export function MenuScreen({
  profile,
  soundOn,
  fontSize,
  onPlay,
  onTeacher,
  onHistory,
  onNavigate,
  onToggleSound,
  onFontSize,
  onLogout,
}: Props) {
  const [search, setSearch] = useState('')

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

  const tiles = [
    { Icon: BookOpen, title: 'Modo treino', sub: 'Sem nota', action: () => onPlay(true) },
    { Icon: History, title: 'Histórico', sub: 'Suas partidas', action: onHistory },
    { Icon: FileText, title: 'Documentos', sub: 'PDFs', action: () => window.open('/docs/index.html', '_blank') },
    { Icon: GraduationCap, title: 'Professora', sub: 'Painel', action: onTeacher },
  ]

  return (
    <QuizLayout
      profile={profile}
      points={stats.ultima}
      activeNav="menu"
      onNavigate={onNavigate}
    >
      <div className="quiz-search">
        <Search aria-hidden size={18} strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar caso ou tema…"
          aria-label="Buscar caso ou tema"
        />
      </div>

      <motion.article
        className="quiz-card quiz-card--hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="quiz-hero-visual">
          <div className="quiz-hero-visual__emoji">🧪</div>
          <span className="quiz-hero-visual__tag">Química ambiental</span>
        </div>
        <div className="quiz-hero-body">
          <h2>Nova investigação</h2>
          <p>Caso sorteado · ~15 min · nota 50% poluente + 50% descarte</p>
          <motion.button
            type="button"
            className="quiz-btn-primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            {...tileMotion}
            onClick={() => {
              playClick()
              onPlay(false)
            }}
          >
            <Play aria-hidden size={20} strokeWidth={2.5} fill="currentColor" /> Jogar agora
          </motion.button>
        </div>
      </motion.article>

      {stats.partidas > 0 && (
        <div className="quiz-stats-row">
          <div className="quiz-stat-box">
            <span>Partidas</span>
            <strong>{stats.partidas}</strong>
          </div>
          <div className="quiz-stat-box">
            <span>Última</span>
            <strong>{stats.ultima ?? '—'}</strong>
          </div>
          <div className="quiz-stat-box">
            <span>Média</span>
            <strong>{stats.media ?? '—'}</strong>
          </div>
        </div>
      )}

      <div className="quiz-grid-2">
        {tiles.map((t) => (
          <motion.button
            key={t.title}
            type="button"
            className="quiz-tile"
            {...tileMotion}
            onClick={() => {
              playClick()
              t.action()
            }}
          >
            <span className="quiz-tile__icon">
              <t.Icon strokeWidth={2} />
            </span>
            <strong>{t.title}</strong>
            <small>{t.sub}</small>
          </motion.button>
        ))}
      </div>

      <div className="quiz-card" style={{ padding: '0.85rem 1rem' }}>
        <label className="toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={soundOn} onChange={onToggleSound} />
          Som {soundOn ? 'ligado' : 'desligado'}
        </label>
        <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--quiz-text-muted)' }}>Fonte:</span>
          {(['p', 'm', 'g'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`quiz-tab${fontSize === s ? ' quiz-tab--active' : ''}`}
              style={{ flex: 'none', padding: '0.35rem 0.75rem' }}
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
      <button type="button" className="quiz-btn-ghost" style={{ width: '100%', marginTop: '0.5rem' }} onClick={onLogout}>
        Sair da conta
      </button>
    </QuizLayout>
  )
}
