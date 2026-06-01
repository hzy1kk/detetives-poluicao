# Design System Master — Detetives da Poluição

> **Override:** Este projeto usa **Premium Dark Fusion**, não o tema claro sugerido automaticamente pela skill.

## Paleta (primitive)

| Token | Hex |
|-------|-----|
| fusion-cyan | `#00f5d4` |
| fusion-violet | `#7b2ff7` |
| fusion-magenta | `#f72585` |
| fusion-deep | `#030712` |
| text-primary | `#e8f4ff` |
| text-muted | `#94a3b8` |

## Estilo

- **Modern Dark Cinema** + glassmorphism
- Fundo: `FusionBackground` (orbs + mesh + grid)
- Cards: `rgba(8, 18, 42, 0.78)` + blur 12–16px

## Tipografia

- Display: Space Grotesk
- Body: Outfit

## Motion

- UI: 150–300ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- Press: `scale(0.97)`
- `prefers-reduced-motion`: sem orbs, partículas, scanline

## Ícones

- Lucide React (nav, tiles, HUD)
- Emojis apenas em narrativa dos casos

## Checklist pré-deploy

- [ ] Contraste 4.5:1 em texto muted
- [ ] Focus ring em botões
- [ ] Touch targets ≥ 44px
- [ ] Teste 375px mobile
