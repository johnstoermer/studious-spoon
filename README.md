# Neon Stick Shooter

A fast-paced, Geometry Dash–styled stick-figure arena shooter inspired by **Duck Game**. Play directly in the browser — no build step required.

## Play locally
1. Open `index.html` in a modern browser (or use `npx serve` and visit the local URL to avoid file:// restrictions).
2. Configure player count, target round wins, and map in the menu.
3. Click **Start Match** and use the controls below.

### Controls
- **Move:** WASD (P1), Arrow keys (P2), IJKL (P3), Numpad 4/6/8/5 (P4)
- **Jump:** Same as up key (double jump enabled)
- **Crouch / Slide:** Down key while moving
- **Shoot:** Mouse button (aim with cursor)
- **Throw weapon:** Q / Right Ctrl / U / Numpad0

## Features implemented
- 2–4 player rounds with configurable win target and four neon arena maps.
- One-hit-kill combat with pistol, shotgun, SMG, sniper, and rocket pickups.
- Mouse-aimed shooting, wall jumps, double jumps, slides, and pickup throws.
- Neon Geometry Dash aesthetic with glowing sticks, platforms, and particle bursts.
- Basic bot behavior for additional players when fewer humans are present.

For the full design goals and backlog, see [`docs/specification.md`](docs/specification.md).
