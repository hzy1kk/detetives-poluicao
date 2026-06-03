import { Lightbulb } from 'lucide-react'
import { MAX_HINTS_PER_RUN } from '../../lib/gameEngine'
import { playClick } from '../../lib/audio'

type Props = {
  used: number
  disabled?: boolean
  onUse: () => void
}

export function HintMeter({ used, disabled, onUse }: Props) {
  const remaining = MAX_HINTS_PER_RUN - used

  function tap(index: number) {
    if (disabled || index >= remaining) return
    playClick()
    onUse()
  }

  return (
    <div className="hint-meter" role="group" aria-label={`Dicas: ${remaining} de ${MAX_HINTS_PER_RUN}`}>
      {Array.from({ length: MAX_HINTS_PER_RUN }, (_, i) => {
        const available = i < remaining
        return (
          <button
            key={i}
            type="button"
            className={`hint-meter__bulb${available ? ' hint-meter__bulb--on' : ' hint-meter__bulb--spent'}`}
            disabled={disabled || !available}
            onClick={() => tap(i)}
            aria-label={available ? `Usar dica ${i + 1} de ${MAX_HINTS_PER_RUN}` : 'Dica ja usada'}
            title={available ? 'Pedir dica' : 'Dica usada'}
          >
            <Lightbulb aria-hidden size={28} strokeWidth={2.25} />
          </button>
        )
      })}
    </div>
  )
}
