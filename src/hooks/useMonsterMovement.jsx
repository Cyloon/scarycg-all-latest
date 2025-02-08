import { useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";

export function useMonsterMovement(points, speed = 1) {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);

  const curve = useMemo(() => {
    const curvePoints = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [points]);

  const [springs, api] = useSpring(() => ({
    progress: 0,
    config: { duration: 1000 / speed, tension: 180, friction: 12 },
  }));

  useFrame(() => {
    const progress = springs.progress.get();
    const u = curve.getUtoTmapping(progress);
    const position = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);

    return {
      position,
      rotation: new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          tangent
        )
      ),
    };
  });

  useEffect(() => {
    api.start({
      progress: 1,
      reset: true,
      loop: true,
      delay: Math.random() * 5000,
      onChange: () => {
        //animation logic goes here
      },
    });
  }, []);

  return springs;
}
