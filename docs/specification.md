# Duck Game Clone with Stick Figures — Development Specification

## Vision
Build a fast-paced 2D multiplayer party shooter inspired by **Duck Game**, but rendered with neon stick figures and Geometry Dash–style visuals. The experience should focus on quick, chaotic rounds with tight controls, dazzling effects, and online multiplayer.

## Core Game Concept
- **Players:** 2–4 simultaneous online players.
- **Rounds:** One-hit kills, 10–30 seconds each; first to configurable target wins match (default 10 round wins).
- **Flow:** Menu → Lobby → Countdown → Round → Round End → Match End → Winner celebration.

## Visual Style (Geometry Dash–Inspired)
- **Palette:** Near-black backgrounds with saturated neon foregrounds; flat colors only, no gradients or textures.
- **Glow:** Every element has a glow outline; discrete zoom/flash effects use player or inverted colors.
- **Readability:** High contrast, geometric shapes only.

### Characters (Stick Figures)
- Neon stick avatars made of glowing line segments.
- **Head:** Solid neon circle with outer glow.
- **Body:** 4–6 px line thickness, glow radius ≈ 1.5× line thickness.
- **Player Colors:** P1 Cyan, P2 Magenta, P3 Lime, P4 Yellow.
- Subtle scale/pulse on actions; head looks toward aim direction.

### Effects
- **Particles:** Pure geometry. Muzzle flashes (expanding circles + rays), bullet trails (snap lines), impacts (triangle/rectangle bursts), death (segments explode), landings (square rings), explosions (concentric circles + debris). Particles shrink or snap off—no fades.
- **Screen FX:** Sharp screen shake, hitstop (2–4 frames) on kills, slow-mo and color pulse on final kill, discrete camera zoom steps, flash effects keyed to player colors.
- **Props:** Dropped weapons wobble; spent shells pile up; kill messages; replay final kill in slow motion.

## Gameplay Mechanics
### Movement
- Fast, responsive run; variable jump height.
- Double jump (configurable power-up or default), wall slide/jump, crouch + slide, drop-through platforms.

### Combat
- All weapons are one-hit kill and limited ammo; weapons can be thrown when empty.
- 360° aiming via mouse; pickups spawn around map; 1 s spawn invulnerability.

### Weapons
- Pistol (6 shots), Shotgun (2 shells, spread), SMG (20 rounds, rapid fire), Sniper (1 shot, hitscan + laser), Rocket launcher (1 rocket, explosive radius).

## Level Design
- Single-screen arenas at 1280×720 or 1920×1080.
- Mix of solid and one-way platforms, destructible cover, hazards (spikes, lava, crushers).
- **Maps (4–6):** Warehouse, Construction Site, Office (water cooler hazard), Rooftops, Laboratory (moving platforms + lasers), Pit (central danger zone).
- Weapon spawn points and safe random player spawns.

## Audio
- Punchy SFX for movement, weapons, kills; upbeat menu music; tense in-game ambience; victory fanfare.

## Technical Requirements
- **Performance:** Target 60 FPS; particle pooling; spatial partitioning for collisions; cap active particles.
- **Controls:** Keyboard (WASD) + mouse aim.
- **Architecture:** Separate input/physics/rendering/game-logic layers; entity-component pattern; game-state machine for menu/lobby/play/round end/match end; event system for effects.

## Game Flow
1. Lobby sets player count (2–4), target round wins, and map.
2. Round countdown: “3, 2, 1, GO!”.
3. Players spawn weaponless, race for pickups, fight until one remains.
4. Winner celebrated; score updates; brief pause before next round.
5. Match ends when a player reaches target wins; show scoreboard and celebration.

## Deliverables
- Playable browser game (HTML5 Canvas or Phaser).
- Main menu with online multiplayer start, player count, round count, map selection, and controls reference.
- Full weapon set, at least four finished maps, and all listed visual/audio effects.

## Development Priorities
1. Core movement and physics.
2. Single weapon (pistol) and shooting loop.
3. Death/respawn and round/match flow.
4. Add remaining weapons.
5. Build multiple maps.
6. Visual effects, polish, and sound.
7. Menu/UI.
8. Multiplayer and final polish.
