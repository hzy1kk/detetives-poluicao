import { vibrateLight } from './haptics'

let ctx: AudioContext | null = null
let enabled = true
let ambientGain: GainNode | null = null
let ambientOscs: OscillatorNode[] = []
let ambientRunning = false

export function setSoundEnabled(on: boolean): void {
  enabled = on
  if (!on) stopAmbient()
}

export async function resumeAudio(): Promise<void> {
  const ac = getCtx()
  if (ac?.state === 'suspended') {
    await ac.resume()
  }
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
  if (ac.state === 'suspended') void ac.resume()
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  osc.connect(g)
  g.connect(ac.destination)
  const t = ac.currentTime
  osc.start(t)
  g.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.stop(t + duration)
}

export function playClick(): void {
  beep(520, 0.06)
  vibrateLight()
}

export function playUnlock(): void {
  beep(660, 0.08)
  setTimeout(() => beep(880, 0.1), 80)
}

export function playSuccess(): void {
  beep(523, 0.1)
  setTimeout(() => beep(659, 0.1), 100)
  setTimeout(() => beep(784, 0.15), 200)
  setTimeout(() => beep(988, 0.12), 320)
}

export function playError(): void {
  beep(220, 0.15, 'square', 0.05)
  setTimeout(() => beep(180, 0.12, 'square', 0.04), 120)
}

export function playWhoosh(): void {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  const filter = ac.createBiquadFilter()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1200, ac.currentTime + 0.25)
  filter.type = 'lowpass'
  filter.frequency.value = 2000
  g.gain.setValueAtTime(0.04, ac.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3)
  osc.connect(filter)
  filter.connect(g)
  g.connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + 0.35)
}

export function playReveal(): void {
  beep(440, 0.06, 'triangle', 0.05)
  setTimeout(() => beep(554, 0.08, 'triangle', 0.05), 60)
}

export function startAmbient(): void {
  if (!enabled || ambientRunning) return
  const ac = getCtx()
  if (!ac) return
  if (ac.state === 'suspended') void ac.resume()

  ambientGain = ac.createGain()
  ambientGain.gain.value = 0.018
  ambientGain.connect(ac.destination)

  const freqs = [110, 164.81, 220]
  ambientOscs = freqs.map((f) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const g = ac.createGain()
    g.gain.value = 0.33
    osc.connect(g)
    g.connect(ambientGain!)
    osc.start()
    return osc
  })

  const lfo = ac.createOscillator()
  const lfoG = ac.createGain()
  lfo.frequency.value = 0.08
  lfoG.gain.value = 0.006
  lfo.connect(lfoG)
  lfoG.connect(ambientGain.gain)
  lfo.start()
  ambientOscs.push(lfo)

  ambientRunning = true
}

export function stopAmbient(): void {
  ambientOscs.forEach((o) => {
    try {
      o.stop()
      o.disconnect()
    } catch {
      /* already stopped */
    }
  })
  ambientOscs = []
  ambientGain = null
  ambientRunning = false
}
