/** Detecta celular / toque grosso para reduzir animações e efeitos pesados. */
export function shouldReduceMotionEffects(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  )
}

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}
