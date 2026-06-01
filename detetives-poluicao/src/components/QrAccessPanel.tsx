import { GAME_URL } from '../data/config'

type Props = {
  compact?: boolean
}

/** QR estático em /qr-jogo.png — gere com npm run qr */
export function QrAccessPanel({ compact }: Props) {
  return (
    <div className={`qr-panel qr-panel--saas ${compact ? 'qr-panel--compact' : ''}`}>
      <img src="/qr-jogo.png" alt="QR Code para abrir o jogo" className="qr-panel__img" width={160} height={160} />
      <div>
        <p className="qr-panel__title">ESCANEIE O QR</p>
        <p className="qr-panel__url">{GAME_URL}</p>
        <p className="qr-panel__hint">Cada aluno usa apenas seu nome ou usuario.</p>
      </div>
    </div>
  )
}
