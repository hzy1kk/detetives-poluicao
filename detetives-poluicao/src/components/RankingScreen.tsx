import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SCHOOL } from '../data/config'
import { buildRanking, getPlayerRank } from '../lib/ranking'
import type { Screen, StudentProfile } from '../types'
import { QuizLayout } from './quiz/QuizLayout'

type Props = {
  profile: StudentProfile
  onNavigate: (screen: Screen) => void
}

type Tab = 'all' | 'top' | 'me'

export function RankingScreen({ profile, onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('all')
  const rows = useMemo(() => buildRanking(profile.turma, 30), [profile.turma])
  const mine = getPlayerRank(profile.nome, profile.turma)

  const podium = rows.slice(0, 3)
  const list = useMemo(() => {
    if (tab === 'top') return rows.slice(0, 10)
    if (tab === 'me') return rows.filter((r) => r.aluno === profile.nome)
    return rows
  }, [rows, tab, profile.nome])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: 'TODOS' },
    { id: 'top', label: 'TOP 10' },
    { id: 'me', label: 'EU' },
  ]

  return (
    <QuizLayout profile={profile} activeNav="ranking" onNavigate={onNavigate}>
      <h2 className="quiz-page-title retro">MELHORES NOTAS</h2>
      <p className="quiz-page-lead">Turma {profile.turma} · neste aparelho</p>

      <div className="bit-tab-row">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`bit-menu-item retro${tab === id ? ' bit-menu-item--active' : ''}`}
            style={{ flex: 1, textAlign: 'center', padding: '0.5rem 0.25rem' }}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="quiz-card bit-box">
          <p className="bit-tagline" style={{ margin: 0 }}>
            Nenhuma partida com nota ainda. Seja o primeiro!
          </p>
        </div>
      ) : (
        <>
          {tab === 'all' && podium.length > 0 && (
            <div className="bit-podium">
              {[podium[1], podium[0], podium[2]].filter(Boolean).map((r, i) => {
                const place = i === 0 ? 2 : i === 1 ? 1 : 3
                const medals = ['2ND', '1ST', '3RD']
                return (
                  <div key={r!.aluno} className={`bit-podium__slot bit-podium__slot--${place}`}>
                    <span className="retro bit-podium__medal">{medals[i]}</span>
                    <span className="bit-podium__name">{r!.aluno.split(' ')[0]}</span>
                    <strong className="retro bit-podium__score">{r!.notaTotal}</strong>
                  </div>
                )
              })}
            </div>
          )}

          {mine && (
            <div className="quiz-card quiz-card--highlight bit-box">
              <strong className="retro" style={{ fontSize: '0.5rem' }}>
                RANK #{mine.posicao}
              </strong>
              <span className="quiz-highlight-score retro">{mine.notaTotal}/100</span>
            </div>
          )}

          <div className="quiz-card bit-box">
            {list.map((r) => (
              <motion.div
                key={r.aluno + r.posicao}
                className="quiz-list-item"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className={`quiz-list-rank retro${r.posicao <= 3 ? ' quiz-list-rank--top' : ''}`}>
                  {String(r.posicao).padStart(2, '0')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block', fontFamily: 'var(--font-retro)', fontSize: '1.1rem' }}>
                    {r.aluno}
                  </strong>
                  <small style={{ color: 'var(--quiz-text-muted)' }}>{r.casoNome}</small>
                </div>
                <strong className="retro" style={{ color: 'var(--8bit-green)', fontSize: '0.55rem' }}>
                  {r.notaTotal}
                </strong>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <p className="bit-tagline" style={{ textAlign: 'center', fontSize: '1rem' }}>
        {SCHOOL.professora} · 50+50
      </p>
    </QuizLayout>
  )
}
