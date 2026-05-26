import { motion } from 'framer-motion'
import { SCHOOL } from '../data/config'
import { buildRanking, getPlayerRank } from '../lib/ranking'
import { playClick } from '../lib/audio'
import type { StudentProfile } from '../types'
import { AnimatedPanel } from './ui/AnimatedPanel'

type Props = {
  profile: StudentProfile
  onBack: () => void
}

export function RankingScreen({ profile, onBack }: Props) {
  const rows = buildRanking(profile.turma, 30)
  const mine = getPlayerRank(profile.nome, profile.turma)

  return (
    <AnimatedPanel className="card ranking-card">
      <h2>🏆 Ranking</h2>
      <p className="lead">Melhores notas registradas neste aparelho.</p>

      {mine && (
        <div className="ranking-you">
          <strong>Sua posição:</strong> #{mine.posicao} · {mine.notaTotal}/100 · {mine.casoNome}
        </div>
      )}

      {rows.length === 0 ? (
        <p>Nenhuma partida valendo nota ainda. Seja o primeiro a investigar!</p>
      ) : (
        <div className="table-wrap">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Detetive</th>
                <th>Nota</th>
                <th>Poluente+Descarte</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <motion.tr
                  key={r.aluno}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: r.posicao * 0.03 }}
                  className={r.aluno === profile.nome ? 'ranking-row--me' : ''}
                >
                  <td>
                    {r.posicao === 1 ? '🥇' : r.posicao === 2 ? '🥈' : r.posicao === 3 ? '🥉' : r.posicao}
                  </td>
                  <td>{r.aluno}</td>
                  <td>
                    <strong>{r.notaTotal}</strong>/100
                  </td>
                  <td>{r.correto ? '✓ completo' : 'parcial'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="creditos-mini">
        {SCHOOL.professora} · Nota mensal: 50% poluente + 50% descarte
      </p>
      <button
        type="button"
        className="btn-primary btn-block"
        onClick={() => {
          playClick()
          onBack()
        }}
      >
        Voltar ao menu
      </button>
    </AnimatedPanel>
  )
}
