# Detetives da Poluição — Design System (8-bit)

**Style:** Pixel Art (UI UX Pro Max) · Reference: OrcDev 8bitcn main-menu

## Palette (NES / Arcade)

| Token | Hex | Use |
|-------|-----|-----|
| `--8bit-bg` | #1a1c2e | Screen background |
| `--8bit-blue` | #29adff | Primary actions, menu hover |
| `--8bit-green` | #00e436 | START / success |
| `--8bit-yellow` | #ffec27 | Titles |
| `--8bit-red` | #ff0044 | Errors |
| `--8bit-black` | #000000 | Pixel borders |

## Typography

- **Press Start 2P** — titles, buttons, menu (`.retro`)
- **VT323** — body, descriptions

## Rules

- No border-radius (sharp pixels)
- Borders: 4px solid black + offset box-shadow
- Menu: vertical list with ▶ on active item
- `image-rendering: pixelated` on icons
- `prefers-reduced-motion`: disable star twinkle and title blink

## Anti-patterns

- Glassmorphism, soft gradients (removed)
- Rounded pills, emoji as nav icons on main menu
