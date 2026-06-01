import type { Clue, GameCase, GameSession } from '../../types'
import { playClick } from '../../lib/audio'

type Props = {
  gameCase: GameCase
  session: GameSession
  pistas: Clue[]
  onUpdateSession: (s: GameSession) => void
}

export function EvidenceBoard({ gameCase, session, pistas, onUpdateSession }: Props) {
  if (pistas.length === 0) return null

  const counts = new Map<string, number>()
  for (const p of pistas) {
    const s = session.pistaSuspeito[p.id]
    if (s) counts.set(s, (counts.get(s) ?? 0) + 1)
  }

  function togglePin(clueId: string, suspeito: string) {
    playClick()
    const current = session.pistaSuspeito[clueId]
    const next =
      current === suspeito
        ? { ...session.pistaSuspeito, [clueId]: null }
        : { ...session.pistaSuspeito, [clueId]: suspeito }
    onUpdateSession({ ...session, pistaSuspeito: next })
  }

  return (
    <div className="evidence-board bit-box">
      <p className="retro evidence-board__title">QUADRO DE TEORIAS</p>
      <p className="evidence-board__hint">Fixe cada pista no suspeito que ela apoia.</p>

      <div className="evidence-board__theories">
        {gameCase.suspeitos.map((s) => (
          <div key={s} className="evidence-board__theory">
            <span className="retro">{counts.get(s) ?? 0}</span>
            <span className="evidence-board__theory-name">{s.length > 28 ? `${s.slice(0, 26)}…` : s}</span>
          </div>
        ))}
      </div>

      {pistas.map((p, i) => (
        <div key={p.id} className="evidence-board__clue">
          <p className="evidence-board__clue-text">
            <span className="quiz-pista-chip">P{i + 1}</span> {p.texto}
          </p>
          <div className="evidence-board__pins">
            {gameCase.suspeitos.map((s) => (
              <button
                key={s}
                type="button"
                className={`evidence-pin${session.pistaSuspeito[p.id] === s ? ' evidence-pin--on' : ''}`}
                title={s}
                onClick={() => togglePin(p.id, s)}
              >
                {session.pistaSuspeito[p.id] === s ? '●' : '○'}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
