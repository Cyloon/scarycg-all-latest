import { useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";

export function useMonsterMovement(points, speed = 1) {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  const [springs, api] = useSpring(() => ({
    position: points[0],
    config: { mass: 1, tension: 120, friction: 14 },
  }));

  useEffect(() => {
    const moveToNextPoint = () => {
      setCurrentPointIndex((prev) => (prev + 1) % points.length);
    };

    api.start({
      position: points[currentPointIndex],
      config: { duration: 1000 / speed },
      onChange: () => {},
      onRest: moveToNextPoint,
    });
  }, [currentPointIndex, points, speed]);

  return springs;
}
