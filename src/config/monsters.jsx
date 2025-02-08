export const MONSTERS = [
  {
    type: "zombie",
    component: "Zombie",
    baseHealth: 100,
    speed: 1,
    model: "./models/zombie-transformed.glb",
    animations: {
      walk: "EnemyArmature|EnemyArmature|EnemyArmature|Walk",
      attack: "EnemyArmature|EnemyArmature|EnemyArmature|Attack",
      death: "EnemyArmature|EnemyArmature|EnemyArmature|Death",
    },
  },
  {
    type: "skeleton",
    component: "Skeleton",
    baseHealth: 100,
    speed: 1,
    model: "./models/skeleton-transformed.glb",
    animations: {
      walk: "Walk",
      attack: "Attack",
      death: "Death",
    },
  },
];
