import { GAME_URL } from '../data/config'

type Props = {
  compact?: boolean
}

/** QR estático em /qr-jogo.png — gere com npm run qr */
export function QrAccessPanel({ compact }: Props) {
  return (
    <div className={`qr-panel ${compact ? 'qr-panel--compact' : ''}`}>
      <img src="/qr-jogo.png" alt="QR Code para abrir o jogo" className="qr-panel__img" width={160} height={160} />
      <div>
        <p className="qr-panel__title">Acesse pelo celular</p>
        <p className="qr-panel__url">{GAME_URL}</p>
        <p className="qr-panel__hint">Senha: <strong>detetive01</strong></p>
      </div>
    </div>
  )
}
