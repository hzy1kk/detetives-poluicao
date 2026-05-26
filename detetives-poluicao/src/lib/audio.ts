let ctx: AudioContext | null = null
let enabled = true

export function setSoundEnabled(on: boolean): void {
  enabled = on
}

function getCtx(): AudioContext | null {
  if (!enabled) return null
  if (!ctx) {
    try {
      ctx = new AudioContext()
    } catch {
      return null
    }
  }
  return ctx
}

function beep(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.08): void {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  osc.connect(g)
  g.connect(ac.destination)
  osc.start()
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  osc.stop(ac.currentTime + duration)
}

export function playClick(): void {
  beep(520, 0.06)
}

export function playUnlock(): void {
  beep(660, 0.08)
  setTimeout(() => beep(880, 0.1), 80)
}

export function playSuccess(): void {
  beep(523, 0.1)
  setTimeout(() => beep(659, 0.1), 100)
  setTimeout(() => beep(784, 0.15), 200)
}

export function playError(): void {
  beep(220, 0.15, 'square', 0.05)
}
