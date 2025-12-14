export const WEAPON_TYPES = {
  pistol: {
    name: 'Pistol',
    ammo: 6,
    fireRate: 240,
    spread: 0.03,
    bulletSpeed: 16,
    color: '#4df3ff',
    recoil: 0.2
  },
  shotgun: {
    name: 'Shotgun',
    ammo: 2,
    fireRate: 600,
    pellets: 6,
    spread: 0.35,
    bulletSpeed: 14,
    color: '#ffe55c',
    recoil: 0.45
  },
  smg: {
    name: 'SMG',
    ammo: 20,
    fireRate: 120,
    spread: 0.12,
    bulletSpeed: 15,
    color: '#ff58c3',
    recoil: 0.15
  },
  sniper: {
    name: 'Sniper',
    ammo: 1,
    fireRate: 900,
    spread: 0,
    bulletSpeed: 28,
    color: '#8afd44',
    recoil: 0.6,
    hitscan: true
  },
  rocket: {
    name: 'Rocket',
    ammo: 1,
    fireRate: 1200,
    spread: 0.05,
    bulletSpeed: 10,
    color: '#ff9f43',
    recoil: 0.3,
    explosive: true,
    radius: 90
  }
};

export function getWeaponPool() {
  return ['pistol', 'shotgun', 'smg', 'sniper', 'rocket'];
}
