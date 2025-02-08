import { useCallback, useRef } from "react";
import { Vector3, Raycaster } from "three";

export function useEnemyDetection({
  lightRef,
  scene,
  isPaused,
  bottomRadius,
  config,
  addScore,
}) {
  const raycasterRef = useRef(new Raycaster());

  const generateRandomPointsInCone = useCallback((numPoints, radius) => {
    return Array.from({ length: numPoints }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      return new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0);
    });
  }, []);

  const checkForEnemyHits = useCallback(() => {
    if (!lightRef.current || !scene || isPaused) return;
    if (bottomRadius <= 0) return;

    const lightPosition = lightRef.current.position.cone();

    try {
      const randomPoints = generateRandomPointsInCone(
        config.RANDOM_POINTS,
        bottomRadius
      );

      randomPoints.forEach((point) => {
        const direction = point.clone().sub(lightPosition).normalize();
        raycasterRef.current.set(lightPosition, direction);

        const intersects = raycasterRef.current.intersectObjects(
          scene.children,
          true
        );

        const enemyHit = intersects.find((hit) => {
          const object = hit.object;
          return (
            object.userData?.type === "enemy" &&
            typeof object.userData?.handleDamage === "function"
          );
        });

        if (enemyHit) {
          try {
            enemyHit.object.userData.handleDamage(1);
            addScore(1);
          } catch (error) {
            console.warn("Error handling enemy damage:", error);
          }
        }
      });
    } catch (error) {
      console.error("Error checking for enemy hits:", error);
    }
  }, [scene, isPaused, bottomRadius, config.RANDOM_POINTS, addScore]);

  return { checkForEnemyHits };
}
