import type { GameCase, GameSession } from '../../types'
import { playClick, playReveal } from '../../lib/audio'

type Props = {
  gameCase: GameCase
  session: GameSession
  totalPistas: number
  onVisit: (hotspotId: string) => void
}

export function CaseMap({ gameCase, session, totalPistas, onVisit }: Props) {
  const collected = session.cluesRevealed
  const done = collected >= totalPistas
  const allVisited = gameCase.mapaLocais.every((l) => session.locaisVisitados.includes(l.id))
  const needMore = collected < totalPistas

  return (
    <div className={`case-map case-map--${gameCase.cenario}`}>
      <p className="retro case-map__title">MAPA DA CENA</p>
      <p className="case-map__sub">
        {done
          ? 'Todas as pistas coletadas.'
          : `Explore um local (${collected}/${totalPistas})`}
      </p>
      <div className="case-map__grid">
        {gameCase.mapaLocais.map((loc) => {
          const visited = session.locaisVisitados.includes(loc.id)
          const canClick = needMore && (!visited || (allVisited && needMore))
          return (
            <button
              key={loc.id}
              type="button"
              className={`case-map__spot${visited && !canClick ? ' case-map__spot--visited' : ''}`}
              disabled={done || !canClick}
              onClick={() => {
                playClick()
                playReveal()
                onVisit(loc.id)
              }}
            >
              <span className="case-map__emoji" aria-hidden>
                {loc.emoji}
              </span>
              <span className="retro case-map__label">{loc.label}</span>
              {visited && !canClick && <span className="case-map__check">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
