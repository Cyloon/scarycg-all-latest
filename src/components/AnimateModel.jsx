import { useSpring, animated } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function AnimatedModel({ points, duration = 12000, state, children }) {
  const ref = useRef();

  const curve = useMemo(() => {
    const curvePoints = points.map((point) => new THREE.Vector3(...point));
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [points]);

  const { progress } = useSpring({
    from: { progress: 0 },
    to: { progress: 1 },
    config: {
      duration: state === "DEATH" ? duration / 2 : duration,
    },
    loop: state !== "DEATH",
    pause: state === "ATTACK",
  });

  useFrame(() => {
    if (!ref.current) return;

    const t = progress.get();
    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);

    ref.current.position.copy(position);
    ref.current.lookAt(position.clone().add(tangent));
  });

  return <animated.group ref={ref}>{children}</animated.group>;
}

export default AnimatedModel;
