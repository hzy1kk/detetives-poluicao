import { useEffect, useState } from 'react'

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    function move(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    function leave() {
      setVisible(false)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', leave)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="cursor-glow"
      aria-hidden
      style={{
        left: pos.x,
        top: pos.y,
      }}
    />
  )
}
