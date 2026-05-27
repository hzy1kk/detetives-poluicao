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
  const rows = buildRanking(profile.turma, 30)
  const mine = getPlayerRank(profile.nome, profile.turma)

  const podium = rows.slice(0, 3)
  const list = useMemo(() => {
    if (tab === 'top') return rows.slice(0, 10)
    if (tab === 'me') return rows.filter((r) => r.aluno === profile.nome)
    return rows
  }, [rows, tab, profile.nome])

  return (
    <QuizLayout profile={profile} activeNav="ranking" onNavigate={onNavigate}>
      <h2 className="quiz-page-title">🏆 Ranking</h2>
      <p className="quiz-page-lead">Melhores notas neste aparelho · turma {profile.turma}</p>

      <div className="quiz-tabs">
        {(
          [
            ['all', 'Geral'],
            ['top', 'Top 10'],
            ['me', 'Eu'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`quiz-tab${tab === id ? ' quiz-tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="quiz-card">
          <p style={{ margin: 0, color: 'var(--quiz-text-muted)' }}>
            Nenhuma partida valendo nota ainda. Seja o primeiro!
          </p>
        </div>
      ) : (
        <>
          {tab === 'all' && podium.length > 0 && (
            <div className="quiz-podium">
              {[podium[1], podium[0], podium[2]].filter(Boolean).map((r, i) => {
                const place = i === 0 ? 2 : i === 1 ? 1 : 3
                const medals = ['🥈', '🥇', '🥉']
                return (
                  <div key={r!.aluno} className={`quiz-podium__place quiz-podium__place--${place}`}>
                    <div className="quiz-podium__avatar">{medals[i]}</div>
                    <span className="quiz-podium__name">{r!.aluno.split(' ')[0]}</span>
                    <span className="quiz-podium__score">{r!.notaTotal} pts</span>
                    <div className="quiz-podium__block" />
                  </div>
                )
              })}
            </div>
          )}

          {mine && (
            <div className="quiz-card" style={{ marginBottom: '1rem', background: 'var(--quiz-green-soft)' }}>
              <strong>Sua posição: #{mine.posicao}</strong>
              <span style={{ marginLeft: '0.5rem', color: 'var(--quiz-green-dark)' }}>
                {mine.notaTotal}/100
              </span>
            </div>
          )}

          <div className="quiz-card">
            {list.map((r) => (
              <motion.div
                key={r.aluno + r.posicao}
                className="quiz-list-item"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span
                  className={`quiz-list-rank${r.posicao <= 3 ? ' quiz-list-rank--top' : ''}`}
                >
                  {r.posicao}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block' }}>{r.aluno}</strong>
                  <small style={{ color: 'var(--quiz-text-muted)' }}>{r.casoNome}</small>
                </div>
                <strong style={{ color: 'var(--quiz-green)' }}>{r.notaTotal}</strong>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--quiz-text-muted)', textAlign: 'center' }}>
        {SCHOOL.professora} · 50% poluente + 50% descarte
      </p>
    </QuizLayout>
  )
}
