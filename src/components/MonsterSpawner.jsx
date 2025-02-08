import { useEffect } from "react";
import { Skeleton } from "./monsters/Skeleton";

const SPAWN_POINTS = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

export function MonsterSpawner() {
  const [monsters, setMonsters] = useState([]);
  const [gameState, setGameState] = useState("playing");

  useEffect(() => {
    if (gameState === "playing") {
      const spawnInterval = setInterval(() => {
        const spawnPoint =
          SPAWN_POINTS[Math.floor(Math.random() * SPAWN_POINTS.length)];

        setMonsters((prev) => [
          ...prev,
          {
            id: `monster-${Date.now()}`,
            position: spawnPoint,
            type: "skeleton",
          },
        ]);
      }, 5000);

      return () => clearInterval(spawnInterval);
    }
  }, [gameState]);

  return (
    <>
      {monsters.map((monster) => (
        <Skeleton
          key={monster.id}
          id={monster.id}
          position={monster.position}
        />
      ))}
    </>
  );
}
