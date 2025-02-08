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

  const randomPointsCache = useRef([]);

  const direction = new Vector3();

  const updateRandomPoints = useCallback(
    (bottomRadius) => {
      if (!randomPointsCache.current.length) {
        randomPointsCache.current = Array.from(
          { length: config.RANDOM_POINTS },
          () => new Vector3()
        );
      }

      randomPointsCache.current.forEach((point) => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * bottomRadius;
        point.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      });

      return randomPointsCache.current;
    },
    [config.RANDOM_POINTS]
  );

  const checkForEnemyHits = useCallback(() => {
    if (!lightRef.current || !scene || isPaused) return;
    if (bottomRadius <= 0) return;

    const lightPosition = lightRef.current.position.clone();
    const randomPoints = updateRandomPoints(bottomRadius);

    try {
      for (const point of randomPoints) {
        direction.copy(point).sub(lightPosition).normalize();

        raycasterRef.current.set(lightPosition, direction);

        const intersects = raycasterRef.current.intersectObjects(
          scene.children,
          true
        );

        if (intersects.length > 0) {
          const firstHit = intersects[0];
          if (firstHit.object.userData?.type === "enemy") {
            try {
              firstHit.object.userData.handleDamage(1);
              addScore(1);
            } catch (error) {
              console.warn("Error handling enemy damage:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking for enemy hits:", error);
    }
  }, [scene, isPaused, bottomRadius, config.RANDOM_POINTS, addScore]);

  return { checkForEnemyHits };
}
