export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(pattern)
    } catch {
      /* ignore */
    }
  }
}

export function vibrateSuccess(): void {
  vibrate([30, 50, 30])
}

export function vibrateError(): void {
  vibrate([80, 40, 80])
}

export function vibrateLight(): void {
  vibrate(12)
}
