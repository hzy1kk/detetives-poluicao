type Cenario = 'agua' | 'solo' | 'lago'

type Props = {
  cenario?: Cenario
  lite?: boolean
}

/** Fundo 8-bit: grade + estrelas + scanline CRT; paleta por cenario */
export function PixelBackground({ cenario, lite = false }: Props) {
  const starCount = lite ? 16 : 48

  return (
    <div className={`pixel-bg${cenario ? ` pixel-bg--${cenario}` : ''}`} aria-hidden>
      <div className="pixel-bg__grid" />
      <div className="pixel-bg__stars">
        {Array.from({ length: starCount }, (_, i) => (
          <span
            key={i}
            className="pixel-bg__star"
            style={{
              left: `${(i * 17 + 7) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
              animationDelay: `${(i % 8) * 0.4}s`,
              opacity: i % 3 === 0 ? 1 : 0.5,
            }}
          />
        ))}
      </div>
      <div className="pixel-bg__scan" />
    </div>
  )
}
