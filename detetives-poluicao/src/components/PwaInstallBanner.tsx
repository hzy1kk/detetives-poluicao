import { useEffect, useState } from 'react'
import { playClick } from '../lib/audio'

const DISMISS_KEY = 'detetives-pwa-banner-dismiss'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function install() {
    playClick()
    if (!deferred) return
    await deferred.prompt()
    setVisible(false)
    setDeferred(null)
  }

  function dismiss() {
    playClick()
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="pwa-banner bit-box" role="region" aria-label="Instalar aplicativo">
      <p className="retro pwa-banner__title">INSTALAR JOGO</p>
      <p className="pwa-banner__text">Instale o jogo na tela inicial para jogar offline.</p>
      <div className="pwa-banner__actions">
        <button type="button" className="bit-btn bit-btn--green retro" onClick={install}>
          INSTALAR
        </button>
        <button type="button" className="quiz-btn-ghost retro" onClick={dismiss}>
          Depois
        </button>
      </div>
    </div>
  )
}
