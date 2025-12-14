import { MAPS, PLAYER_COLORS } from './maps.js';
import { WEAPON_TYPES, getWeaponPool } from './weapons.js';

const DEFAULT_MAP_KEY = Object.keys(MAPS)[0] || 'warehouse';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const keyState = new Set();
const mouse = { x: 0, y: 0, down: false };

const bindings = [
  { left: 'a', right: 'd', up: 'w', down: 's', throwKey: 'q' },
  { left: 'arrowleft', right: 'arrowright', up: 'arrowup', down: 'arrowdown', throwKey: 'control' },
  { left: 'j', right: 'l', up: 'i', down: 'k', throwKey: 'u' },
  { left: 'numpad4', right: 'numpad6', up: 'numpad8', down: 'numpad5', throwKey: 'numpad0' }
];

class Particle {
  constructor(x, y, color, life, size = 6) {
    this.x = x; this.y = y; this.life = life; this.size = size;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 10;
    this.color = color;
  }
  update() {
    this.x += this.dx; this.y += this.dy;
    this.life -= 1;
    this.size *= 0.95;
  }
  draw(ctx) {
    ctx.save();
    ctx.shadowColor = this.color; ctx.shadowBlur = 12;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

class Projectile {
  constructor(x, y, vx, vy, owner, weaponKey) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.owner = owner; this.weaponKey = weaponKey;
    this.life = 90;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.life -= 1;
  }
  draw(ctx) {
    const color = WEAPON_TYPES[this.weaponKey].color;
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.strokeStyle = color; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 1.2, this.y - this.vy * 1.2);
    ctx.stroke();
    ctx.restore();
  }
}

class Pickup {
  constructor(x, y, weaponKey) {
    this.x = x; this.y = y; this.weaponKey = weaponKey;
    this.timer = 30;
  }
  draw(ctx) {
    const weapon = WEAPON_TYPES[this.weaponKey];
    ctx.save();
    ctx.shadowColor = weapon.color; ctx.shadowBlur = 12;
    ctx.strokeStyle = weapon.color; ctx.lineWidth = 3;
    ctx.strokeRect(this.x - 14, this.y - 8, 28, 16);
    ctx.restore();
  }
}

class Player {
  constructor(id, color) {
    this.id = id; this.color = color;
    this.width = 18; this.height = 60;
    this.x = 100; this.y = 100;
    this.vx = 0; this.vy = 0;
    this.onGround = false;
    this.facing = 1;
    this.jumps = 2;
    this.slideTimer = 0;
    this.alive = true;
    this.invulnerable = 0;
    this.weapon = { key: 'pistol', ammo: WEAPON_TYPES.pistol.ammo, cooldown: 0 };
    this.control = id === 0 ? 'human' : 'ai';
  }

  reset(position) {
    this.x = position.x; this.y = position.y;
    this.vx = 0; this.vy = 0; this.onGround = false; this.jumps = 2;
    this.alive = true; this.invulnerable = 45; this.slideTimer = 0;
    this.weapon = { key: 'pistol', ammo: WEAPON_TYPES.pistol.ammo, cooldown: 0 };
  }

  get center() { return { x: this.x, y: this.y - this.height / 2 }; }
}

class Game {
  constructor() {
    this.state = 'menu';
    this.players = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.scores = [];
    this.mapKey = MAPS[DEFAULT_MAP_KEY] ? DEFAULT_MAP_KEY : Object.keys(MAPS)[0];
    this.targetWins = 5;
    this.roundTimer = 0;
    this.bannerTimer = 0;
  }

  initMatch(playerCount, targetWins, mapKey) {
    this.mapKey = mapKey;
    this.targetWins = targetWins;
    this.players = [];
    this.scores = Array(playerCount).fill(0);
    for (let i = 0; i < playerCount; i++) {
      this.players.push(new Player(i, PLAYER_COLORS[i]));
    }
    this.startRound();
  }

  startRound() {
    const map = MAPS[this.mapKey];
    this.projectiles = [];
    this.pickups = map.weaponSpawns.map(spawn => new Pickup(spawn.x, spawn.y - 20, this.randomWeapon()));
    this.particles = [];
    this.roundTimer = 90; // countdown frames (~1.5s)
    map.spawnPoints.forEach((pos, i) => {
      if (this.players[i]) {
        const offset = Math.random() * 40 - 20;
        this.players[i].reset({ x: pos.x + offset, y: pos.y });
      }
    });
    this.state = 'countdown';
    this.bannerTimer = 90;
  }

  randomWeapon() {
    const pool = getWeaponPool();
    return pool[Math.floor(Math.random() * pool.length)];
  }

  killPlayer(player) {
    if (!player.alive) return;
    player.alive = false;
    for (let i = 0; i < 14; i++) {
      this.particles.push(new Particle(player.x, player.y - player.height / 2, player.color, 30, 10));
    }
  }

  update(dt) {
    const map = MAPS[this.mapKey];
    if (this.bannerTimer > 0) this.bannerTimer -= 1;

    if (this.state === 'countdown') {
      this.roundTimer -= 1;
      if (this.roundTimer <= 0) {
        this.state = 'playing';
      }
    }

    if (this.state !== 'playing') return;

    // Moving platforms
    const moving = (map.movingPlatforms || []).map(mp => {
      const t = Date.now() * 0.001 * mp.speed;
      const offset = Math.sin(t) * mp.range;
      return { ...mp, x: mp.x + (mp.axis === 'x' ? offset : 0), y: mp.y + (mp.axis === 'y' ? offset : 0) };
    });
    const platforms = [...map.platforms, ...moving];

    this.players.forEach((p, index) => {
      if (!p.alive) return;
      if (p.invulnerable > 0) p.invulnerable -= 1;

      const input = this.getInput(p, index);
      const maxSpeed = 5 * (p.slideTimer > 0 ? 1.4 : 1);
      const accel = input.x * (p.onGround ? 1 : 0.6);
      p.vx = Math.max(-maxSpeed, Math.min(maxSpeed, p.vx + accel));
      p.vx *= 0.9;
      if (Math.abs(p.vx) < 0.01) p.vx = 0;

      if (input.jump && (p.onGround || p.jumps > 0)) {
        p.vy = -12;
        if (!p.onGround) p.jumps -= 1;
        p.onGround = false;
      }

      p.vy += 0.7; // gravity
      p.vy = Math.min(p.vy, 18);

      // Horizontal movement and wall interaction
      p.x += p.vx;
      const wallHit = this.resolveCollisions(p, platforms, 'x');
      if (wallHit && input.jump) {
        p.vy = -11;
        p.vx = -p.facing * 6;
      }

      p.y += p.vy;
      const groundHit = this.resolveCollisions(p, platforms, 'y');
      p.onGround = groundHit;
      if (groundHit) p.jumps = 2;

      if (input.crouch && p.onGround && Math.abs(p.vx) > 2) {
        p.slideTimer = 30;
      }
      if (p.slideTimer > 0) p.slideTimer -= 1;

      p.facing = input.aimX >= 0 ? 1 : -1;

      if (p.weapon.cooldown > 0) p.weapon.cooldown -= dt;
      if (input.fire && p.weapon.cooldown <= 0 && p.weapon.ammo > 0) {
        this.fireWeapon(p, input);
      }

      if (input.throwWeapon && p.weapon.ammo > 0) {
        this.pickups.push(new Pickup(p.x, p.y - 30, p.weapon.key));
        p.weapon = { key: 'pistol', ammo: 0, cooldown: 0 };
      }

      // weapon pickup
      this.pickups = this.pickups.filter(pk => {
        const dist = Math.hypot(p.x - pk.x, (p.y - 20) - pk.y);
        if (dist < 36) {
          p.weapon = { key: pk.weaponKey, ammo: WEAPON_TYPES[pk.weaponKey].ammo, cooldown: 0 };
          return false;
        }
        return true;
      });

      // hazard check
      map.hazards.forEach(h => {
        if (aabbOverlap(p, h)) this.killPlayer(p);
      });
    });

    // projectiles
    this.projectiles = this.projectiles.filter(b => {
      b.update();
      if (b.life <= 0) return false;
      // collisions
      for (const platform of platforms) {
        if (platform.type !== 'oneway' && pointRect(b.x, b.y, platform)) return false;
      }
      for (const player of this.players) {
        if (!player.alive || player.invulnerable > 0 || player.id === b.owner) continue;
        if (pointRect(b.x, b.y, playerHitbox(player))) {
          this.killPlayer(player);
          if (WEAPON_TYPES[b.weaponKey].explosive) this.explode(b.x, b.y, WEAPON_TYPES[b.weaponKey].radius, b.owner);
          return false;
        }
      }
      return true;
    });

    // particles
    this.particles = this.particles.filter(p => {
      p.update();
      return p.life > 0;
    });

    // round end
    const alive = this.players.filter(p => p.alive);
    if (alive.length <= 1) {
      if (alive[0]) this.scores[alive[0].id] += 1;
      this.state = 'roundEnd';
      this.bannerTimer = 120;
      setTimeout(() => {
        const winner = this.scores.findIndex(s => s >= this.targetWins);
        if (winner >= 0) {
          this.state = 'matchEnd';
        } else {
          this.startRound();
        }
      }, 900);
    }
  }

  getInput(player, index) {
    if (player.control === 'human') {
      const bind = bindings[index];
      return {
        x: (keyState.has(bind.left) ? -1 : 0) + (keyState.has(bind.right) ? 1 : 0),
        jump: keyState.has(bind.up),
        crouch: keyState.has(bind.down),
        fire: mouse.down,
        aimX: mouse.x - player.x,
        aimY: mouse.y - (player.y - player.height / 2),
        throwWeapon: keyState.has(bind.throwKey)
      };
    }

    // Simple AI: chase nearest opponent, jump if below, shoot when lined up
    const target = this.players.find(p => p.alive && p.id !== player.id);
    let dir = 0; let jump = false;
    if (target) {
      dir = target.x > player.x ? 1 : -1;
      if (target.y < player.y - 40 && Math.abs(target.x - player.x) < 120) jump = true;
    }
    const aimX = target ? target.x - player.x : 1;
    const aimY = target ? (target.y - player.y) : 0;
    return { x: dir, jump, crouch: false, fire: true, aimX, aimY, throwWeapon: false };
  }

  fireWeapon(player, input) {
    const weapon = WEAPON_TYPES[player.weapon.key];
    player.weapon.ammo -= 1;
    player.weapon.cooldown = weapon.fireRate / 1000 * 60; // convert ms to frames
    const angle = Math.atan2(input.aimY, input.aimX) + (Math.random() - 0.5) * weapon.spread;
    const speed = weapon.bulletSpeed;
    const muzzle = { x: player.x + Math.cos(angle) * 24, y: (player.y - player.height / 2) + Math.sin(angle) * 24 };

    const spawnBullet = (offsetAngle = 0) => {
      const a = angle + offsetAngle;
      const vx = Math.cos(a) * speed;
      const vy = Math.sin(a) * speed;
      this.projectiles.push(new Projectile(muzzle.x, muzzle.y, vx, vy, player.id, player.weapon.key));
    };

    if (weapon.hitscan) {
      this.hitscan(muzzle, angle, player.id, player.weapon.key);
    } else if (weapon.pellets) {
      for (let i = 0; i < weapon.pellets; i++) {
        spawnBullet((Math.random() - 0.5) * weapon.spread);
      }
    } else {
      spawnBullet();
    }

    for (let i = 0; i < 8; i++) this.particles.push(new Particle(muzzle.x, muzzle.y, weapon.color, 12, 6));
  }

  hitscan(origin, angle, owner, weaponKey) {
    const range = 1400;
    const step = 10;
    const dx = Math.cos(angle) * step;
    const dy = Math.sin(angle) * step;
    let x = origin.x, y = origin.y;
    for (let i = 0; i < range / step; i++) {
      x += dx; y += dy;
      for (const player of this.players) {
        if (!player.alive || player.id === owner || player.invulnerable > 0) continue;
        if (pointRect(x, y, playerHitbox(player))) {
          this.killPlayer(player);
          return;
        }
      }
    }
  }

  explode(x, y, radius, owner) {
    for (const p of this.players) {
      if (!p.alive || p.id === owner) continue;
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist < radius) this.killPlayer(p);
    }
    for (let i = 0; i < 24; i++) {
      this.particles.push(new Particle(x, y, '#ff9f43', 30, 12));
    }
  }

  resolveCollisions(player, platforms, axis) {
    const hitbox = playerHitbox(player);
    let collided = false;
    for (const platform of platforms) {
      const rect = { x: platform.x, y: platform.y, w: platform.w, h: platform.h };
      const before = { x: hitbox.x - (axis === 'x' ? player.vx : 0), y: hitbox.y - (axis === 'y' ? player.vy : 0), w: hitbox.w, h: hitbox.h };
      if (platform.type === 'oneway') {
        if (before.y + before.h > rect.y) continue;
        if (hitbox.y + hitbox.h < rect.y) continue;
        if (axis === 'y' && player.vy > 0 && hitbox.x < rect.x + rect.w && hitbox.x + hitbox.w > rect.x) {
          player.y = rect.y;
          player.vy = 0;
          collided = true;
        }
        continue;
      }

      if (aabbOverlap(hitbox, rect)) {
        if (axis === 'x') {
          if (player.vx > 0) player.x = rect.x - hitbox.w / 2;
          else if (player.vx < 0) player.x = rect.x + rect.w + hitbox.w / 2;
          player.vx = 0; collided = true;
        } else {
          if (player.vy > 0) { player.y = rect.y; player.vy = 0; collided = true; }
          else if (player.vy < 0) { player.y = rect.y + rect.h + player.height; player.vy = 0; }
        }
      }
    }
    return collided;
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#05060a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const map = MAPS[this.mapKey];
    [...map.platforms, ...(map.movingPlatforms || [])].forEach(p => {
      ctx.save();
      ctx.shadowColor = '#2ee6ff'; ctx.shadowBlur = 12;
      ctx.fillStyle = p.type === 'oneway' ? 'rgba(46,230,255,0.4)' : '#0f1526';
      ctx.strokeStyle = '#2ee6ff'; ctx.lineWidth = 2;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeRect(p.x, p.y, p.w, p.h);
      ctx.restore();
    });
    (map.hazards || []).forEach(h => {
      ctx.save();
      ctx.shadowColor = '#ff5f5f'; ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(255,95,95,0.4)';
      ctx.fillRect(h.x, h.y, h.w, h.h);
      ctx.restore();
    });

    this.pickups.forEach(p => p.draw(ctx));
    this.projectiles.forEach(b => b.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));

    this.players.forEach(player => {
      if (!player.alive) return;
      const center = player.center;
      const glow = player.invulnerable > 0 ? '#fff' : player.color;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineWidth = 6;
      ctx.shadowColor = glow; ctx.shadowBlur = 14;
      // torso
      ctx.strokeStyle = glow;
      ctx.beginPath();
      ctx.moveTo(center.x, center.y - 10);
      ctx.lineTo(center.x, center.y + 20);
      ctx.stroke();
      // legs
      ctx.beginPath();
      ctx.moveTo(center.x, center.y + 20);
      ctx.lineTo(center.x - 10, center.y + 40);
      ctx.moveTo(center.x, center.y + 20);
      ctx.lineTo(center.x + 10, center.y + 40);
      ctx.stroke();
      // arms
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + player.facing * 20, center.y + 4);
      ctx.stroke();
      // head
      ctx.beginPath();
      ctx.arc(center.x, center.y - 20, 10, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.restore();

      // weapon overlay
      ctx.save();
      const weapon = player.weapon;
      ctx.fillStyle = WEAPON_TYPES[weapon.key].color;
      ctx.fillRect(player.x - 14, player.y - player.height + 4, 28, 8);
      ctx.restore();
    });

    // crosshair
    ctx.save();
    ctx.strokeStyle = '#ffffff55';
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
    ctx.moveTo(mouse.x - 16, mouse.y);
    ctx.lineTo(mouse.x + 16, mouse.y);
    ctx.moveTo(mouse.x, mouse.y - 16);
    ctx.lineTo(mouse.x, mouse.y + 16);
    ctx.stroke();
    ctx.restore();
  }
}

function playerHitbox(player) {
  return { x: player.x - player.width / 2, y: player.y - player.height, w: player.width, h: player.height };
}

function aabbOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function pointRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

const game = new Game();

function update() {
  game.update(1);
  game.draw();
  requestAnimationFrame(update);
}

// DOM hooks
const menu = document.getElementById('menu');
const hud = document.getElementById('hud');
const banner = document.getElementById('round-banner');
const playerSelect = document.getElementById('player-count');
const winsInput = document.getElementById('target-wins');

function resolveMapKey() {
  const keys = Object.keys(MAPS);
  if (game.mapKey && MAPS[game.mapKey]) return game.mapKey;
  return keys[0] || DEFAULT_MAP_KEY;
}

function renderHud() {
  const left = document.getElementById('hud-left');
  left.innerHTML = '';
  game.players.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'badge';
    el.style.background = `${p.color}22`;
    el.style.border = `1px solid ${p.color}`;
    el.innerHTML = `P${i + 1} — ${p.weapon.ammo} ${WEAPON_TYPES[p.weapon.key].name}`;
    left.appendChild(el);
  });

  const right = document.getElementById('hud-right');
  right.innerHTML = '';
  game.scores.forEach((score, i) => {
    const bar = document.createElement('div');
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.gap = '6px';
    const label = document.createElement('div');
    label.className = 'badge';
    label.style.background = `${PLAYER_COLORS[i]}22`;
    label.style.border = `1px solid ${PLAYER_COLORS[i]}`;
    label.textContent = `P${i + 1}`;
    const progress = document.createElement('div');
    progress.className = 'progress';
    const fill = document.createElement('div');
    fill.className = 'fill';
    const pct = Math.min(score / game.targetWins, 1);
    fill.style.width = `${pct * 100}%`;
    progress.appendChild(fill);
    bar.appendChild(label);
    bar.appendChild(progress);
    right.appendChild(bar);
  });

  const center = document.getElementById('hud-center');
  center.textContent = game.state === 'matchEnd' ? 'Match Over' : game.state === 'countdown' ? 'Countdown' : 'Fight!';
}

function showBanner(text) {
  banner.textContent = text;
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 1000);
}

document.getElementById('start-btn').addEventListener('click', () => {
  const playerCount = Number(playerSelect.value);
  const wins = Number(winsInput.value);
  const mapKey = resolveMapKey();
  if (!MAPS[mapKey]) {
    console.warn('No valid maps available to start a match');
    return;
  }
  game.mapKey = mapKey;
  game.initMatch(playerCount, wins, mapKey);
  game.state = 'countdown';
  menu.classList.add('hidden');
  hud.classList.remove('hidden');
  renderHud();
  showBanner('3...2...1');
});

window.addEventListener('keydown', e => {
  keyState.add(e.key.toLowerCase());
});
window.addEventListener('keyup', e => {
  keyState.delete(e.key.toLowerCase());
});
canvas.addEventListener('mousedown', () => { mouse.down = true; });
canvas.addEventListener('mouseup', () => { mouse.down = false; });
canvas.addEventListener('mouseleave', () => { mouse.down = false; });
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

setInterval(renderHud, 200);
update();
