import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "./monsters/Skeleton";
import { SPAWN_POINTS, MONSTERS } from "../config/monsters";
import { useGameStore } from "../stores/gameStore";
import Zombie from "./monsters/Zombie";

export function MonsterSpawner() {
  //const [monsters, setMonsters] = useState([]);
  //const [gameState, setGameState] = useState("playing");

  const spawnTimerRef = useRef(null);

  const { addEnemy, activeEnemies, gameState } = useGameStore();

  const spawnMonster = () => {
    const spawnPoint = SPAWN_POINTS[1]; //[Math.floor(Math.random() * SPAWN_POINTS.length)];

    let availableTypes = ["skeleton"];

    const monsterType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];

    const enemyId = `enemy-${Date.now()}-${Math.random()}`;
    addEnemy({
      id: enemyId,
      type: "skeleton", //monsterType,
      position: spawnPoint,
    });
  };

  useEffect(() => {
    if (gameState === "playing") {
      const spawnInterval = Math.floor(Math.random() * 5000);
      spawnTimerRef.current = setInterval(() => {
        spawnMonster();
      }, spawnInterval);
      console.log("spawnInterval", spawnInterval);
      console.log("gameState", gameState);

      return () => {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
        }
      };
    }
  }, [gameState]);

  return (
    <>
      {activeEnemies.map((enemy) => (
        <Skeleton key={enemy.id} id={enemy.id} position={enemy.position} />
      ))}
    </>
  );
}
