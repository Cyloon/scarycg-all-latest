import React, { useRef } from "react";
import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function RotatingStars() {
  const stars = useRef();

  useFrame(() => {
    stars.current.rotation.x = stars.current.rotation.y += 0.000015;
  });

  return (
    <Stars
      ref={stars}
      radius={100}
      depth={50}
      count={5000}
      factor={10}
      saturation={0}
      fade
      speed={1}
    />
  );
}

export default RotatingStars;
