export const ANIMATION_STATES = {
  IDLE: "idle",
  WALK: "walk",
  ATTACK: "attack",
  DEATH: "death",
  HIT: "hit",
  JUMP: "jump",
  FLYING: "flying",
  BITE: "bite",
};

export const SPEED_THRESHOLDS = {
  WALK: 1,
  RUN: 1.5,
};

export const MONSTERS = [
  {
    type: "zombie",
    component: "Zombie",
    baseHealth: 100,
    speed: 1,
    model: "./models/zombie-transformed.glb",
    canTakeDamage: true,
    animations: {
      walk: "EnemyArmature|EnemyArmature|EnemyArmature|Walk",
      run: "EnemyArmature|EnemyArmature|EnemyArmature|Run",
      attack: "EnemyArmature|EnemyArmature|EnemyArmature|Attack",
      hit: "EnemyArmature|EnemyArmature|EnemyArmature|HitRecieve",
      death: "EnemyArmature|EnemyArmature|EnemyArmature|Death",
    },
  },
  {
    type: "skeleton",
    component: "Skeleton",
    baseHealth: 100,
    speed: 1,
    model: "./models/Skeleton20.glb",
    canTakeDamage: true,
    animations: {
      walk: "Walk",
      run: "Run",
      attack: "Attack",
      hit: "HitRecieve",
      death: "Death",
    },
  },
  {
    type: "bat",
    component: "Bat",
    baseHealth: 50,
    speed: 1,
    model: "./models/bat-transformed.glb",
    canTakeDamage: true,
    isFlying: true,
    heightRange: { min: 2, max: 3 },
    animations: {
      flying: "Flying",
      attack: "Attack",
      hit: "HitRecieve",
      death: "Death",
    },
  },
  {
    type: "spider",
    component: "Spider",
    baseHealth: 1,
    speed: 1,
    model: "./models/spider-transformed.glb",
    canTakeDamage: false,
    isAmbient: true,
    animations: {
      walk: "Walk",
      attack: "Attack",
      hit: "HitRecieve",
      death: "Death",
    },
  },
];

export const SPAWN_POINTS = [
  [
    [-6, 0, -9], // Starting point Left 4
    [-1, 0, -6], // Control point 1
    [-0.15, 0, 0], // Middle point
    [-0.1, 0, 10], // Control point 2
    [-0.05, 0, 17], // Control point 3
    [0, 0, 23], // Ending point
  ],
  [
    [6, 0, -9], // Starting point Right 4
    [1, 0, -6], // Control point 1
    [0.15, 0, 0], // Middle point
    [0.1, 0, 10], // Control point 2
    [0.05, 0, 17], // Control point 3
    [0, 0, 23], // Ending point
  ],
  [
    [-6, 0, 0], // Starting point Left 3
    [-1, 0, 1], // Control point 1
    [-0.8, 0, 5], // Middle point
    [-0.5, 0, 10], // Control point 2
    [-0.4, 0, 17], // Control point 3
    [-0, 0, 23], // Ending point
  ],
  [
    [6, 0, 0], // Starting point Right 3
    [1, 0, 1], // Control point 1
    [0.8, 0, 5], // Middle point
    [0.5, 0, 10], // Control point 2
    [0.4, 0, 17], // Control point 3
    [0, 0, 27], // Ending point
  ],
  [
    [-6, 0, 5], // Starting point Left 2
    [-1.5, 0, 6], // Control point 1
    [-0.8, 0, 10], // Middle point
    [-0.5, 0, 17], // Control point 2
    [-0, 0, 23], // Ending point
  ],
  [
    [6, 0, 5], // Starting point Right 2
    [1.5, 0, 6], // Control point 1
    [0.8, 0, 10], // Middle point
    [0.5, 0, 17], // Control point 2
    [0, 0, 23], // Ending point
  ],
  [
    [-5, 0, 12], // Starting point Left 1
    [-2, 0, 13], // Control point 1
    [-1.5, 0, 14], // Middle point
    [-0.9, 0, 17], // Control point 2
    [-0, 0, 23], // Ending point]
  ],
  [
    [5, 0, 12], // Starting point Right 1
    [2, 0, 13], // Control point 1
    [1.5, 0, 14], // Middle point
    [0.9, 0, 17], // Control point 2
    [0, 0, 23], // Ending point]
  ],
  [
    [10, 0, 0], // Starting point Right Spider
    [1, 0, 1], // Control point 1
    [0.8, 0, 5], // Middle point
    [-10, 0, 0], // Ending point
  ],
  [
    [-5, 0, 12], // Starting point Left 1
    [-2, 0, 13], // Control point 1
    [-0.5, 0, 12],
    [0, 0, 14],
    [1, 0, 13],
    [7, 0, 14], // Middle point
  ],
];

export const MONSTER_CONFIG = {
  SPAWN_INTERVAL_INITIAL: 5000,
  SPAWN_INTERVAL_MIN: 2000,
  SPAWN_ACCELERATION: 0.95,
};
