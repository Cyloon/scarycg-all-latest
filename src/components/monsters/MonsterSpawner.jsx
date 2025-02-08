import { useEffect, useRef } from "react";
import { useGameStore } from "../../stores/gameStore";
import { MONSTERS, SPAWN_POINTS } from "../../config/monsters";
import { Bat } from "./Bat";
import { Spider } from "./Spider";
import { Zombie } from "./Zombie";

const MonsterComponents = {
  spider: Spider,
  bat: Bat,
  zombie: Zombie,
};

export function MonsterSpawner() {
  const spawnTimerRef = useRef(null);
  const {
    addEnemy,
    removeEnemy,
    enemies,
    gameState,
    currentWave,
    increaseWave,
  } = useGameStore();

  const spawnMonster = () => {
    const spawnPoint =
      SPAWN_POINTS[Math.floor(Math.random() * SPAWN_POINTS.length)];

    let availableTypes = ["zombie"];
    if (currentWave >= 2) availableTypes.push("bat");
    if (currentWave >= 5) availableTypes.push("spider");

    const monsterType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];

    const enemyId = `enemy-${Date.now()}-${Math.random()}`;
    addEnemy({
      id: enemyId,
      type: monsterType,
      position: spawnPoint,
    });
  };

  useEffect(() => {
    if (gameState === "playing") {
      const spawnInterval = Math.max(5000 - currentWave * 500, 1000);

      spawnTimerRef.current = setInterval(spawnMonster, spawnInterval);

      return () => {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
        }
      };
    }
  }, [gameState, currentWave]);

  return (
    <>
      {enemies.map((enemy) => {
        const MonsterComponent = MonsterComponents[enemy.type];
        return (
          <MonsterComponent
            key={enemy.id}
            id={enemy.id}
            position={enemy.position}
          />
        );
      })}
    </>
  );
}
