export const MAPS = {
  warehouse: {
    name: 'Warehouse',
    spawnPoints: [
      { x: 150, y: 500 },
      { x: 1100, y: 500 },
      { x: 300, y: 320 },
      { x: 980, y: 320 }
    ],
    weaponSpawns: [
      { x: 640, y: 300 },
      { x: 640, y: 520 },
      { x: 220, y: 420 },
      { x: 1060, y: 420 }
    ],
    platforms: [
      { x: 0, y: 660, w: 1280, h: 60, type: 'solid' },
      { x: 120, y: 520, w: 280, h: 18, type: 'solid' },
      { x: 880, y: 520, w: 280, h: 18, type: 'solid' },
      { x: 500, y: 420, w: 280, h: 18, type: 'oneway' },
      { x: 140, y: 340, w: 200, h: 18, type: 'solid' },
      { x: 940, y: 340, w: 200, h: 18, type: 'solid' },
      { x: 600, y: 280, w: 80, h: 18, type: 'solid' }
    ],
    hazards: [
      { x: 0, y: 690, w: 1280, h: 30 }
    ]
  },
  rooftops: {
    name: 'Rooftops',
    spawnPoints: [
      { x: 160, y: 580 },
      { x: 1120, y: 580 },
      { x: 320, y: 400 },
      { x: 960, y: 400 }
    ],
    weaponSpawns: [
      { x: 640, y: 200 },
      { x: 640, y: 420 },
      { x: 320, y: 520 },
      { x: 960, y: 520 }
    ],
    platforms: [
      { x: 0, y: 660, w: 1280, h: 60, type: 'solid' },
      { x: 320, y: 560, w: 640, h: 18, type: 'oneway' },
      { x: 120, y: 420, w: 240, h: 18, type: 'solid' },
      { x: 920, y: 420, w: 240, h: 18, type: 'solid' },
      { x: 540, y: 300, w: 200, h: 18, type: 'solid' },
      { x: 0, y: 300, w: 160, h: 18, type: 'oneway' },
      { x: 1120, y: 300, w: 160, h: 18, type: 'oneway' }
    ],
    hazards: [
      { x: 0, y: 690, w: 1280, h: 30 }
    ]
  },
  laboratory: {
    name: 'Laboratory',
    spawnPoints: [
      { x: 200, y: 500 },
      { x: 1080, y: 500 },
      { x: 640, y: 380 },
      { x: 640, y: 200 }
    ],
    weaponSpawns: [
      { x: 640, y: 420 },
      { x: 640, y: 600 },
      { x: 220, y: 360 },
      { x: 1060, y: 360 }
    ],
    platforms: [
      { x: 0, y: 660, w: 1280, h: 60, type: 'solid' },
      { x: 280, y: 520, w: 720, h: 18, type: 'solid' },
      { x: 560, y: 380, w: 160, h: 18, type: 'oneway' },
      { x: 160, y: 320, w: 200, h: 18, type: 'solid' },
      { x: 920, y: 320, w: 200, h: 18, type: 'solid' },
      { x: 560, y: 220, w: 160, h: 18, type: 'solid' }
    ],
    hazards: [
      { x: 480, y: 640, w: 320, h: 20 },
      { x: 0, y: 690, w: 1280, h: 30 }
    ],
    movingPlatforms: [
      { x: 320, y: 440, w: 120, h: 18, type: 'oneway', range: 120, speed: 0.8, axis: 'x' },
      { x: 840, y: 440, w: 120, h: 18, type: 'oneway', range: 120, speed: 0.8, axis: 'x' }
    ]
  },
  pit: {
    name: 'Pit',
    spawnPoints: [
      { x: 200, y: 320 },
      { x: 1080, y: 320 },
      { x: 640, y: 160 },
      { x: 640, y: 520 }
    ],
    weaponSpawns: [
      { x: 640, y: 180 },
      { x: 320, y: 340 },
      { x: 960, y: 340 },
      { x: 640, y: 520 }
    ],
    platforms: [
      { x: 0, y: 660, w: 1280, h: 60, type: 'solid' },
      { x: 240, y: 360, w: 240, h: 18, type: 'solid' },
      { x: 800, y: 360, w: 240, h: 18, type: 'solid' },
      { x: 520, y: 240, w: 240, h: 18, type: 'solid' },
      { x: 520, y: 520, w: 240, h: 18, type: 'oneway' }
    ],
    hazards: [
      { x: 0, y: 690, w: 1280, h: 30 }
    ]
  }
};

export const PLAYER_COLORS = ['#4df3ff', '#ff58c3', '#8afd44', '#ffe55c'];
