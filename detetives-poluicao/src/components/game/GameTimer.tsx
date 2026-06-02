import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { formatTime } from '../../lib/gameEngine'

type Props = {
  startedAt: number
}

/** Timer isolado — evita re-renderizar a tela inteira do jogo a cada segundo. */
export function GameTimer({ startedAt }: Props) {
  const [sec, setSec] = useState(() =>
    Math.max(0, Math.floor((Date.now() - startedAt) / 1000)),
  )

  useEffect(() => {
    const tick = () => setSec(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  return (
    <span className="quiz-timer-pill">
      <Clock aria-hidden size={16} strokeWidth={2} />
      {formatTime(sec)}
    </span>
  )
}
