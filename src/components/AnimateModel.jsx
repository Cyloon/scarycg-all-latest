import { useSpring, animated } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { useState } from "react";
import * as THREE from "three";
import { Healthbar } from "./Healthbar";

function AnimatedModel({
  key,
  component,
  points,
  healthbar,
  spawndelay,
  duration = 12000,
}) {
  const ref = useRef();
  const healthBarRef = useRef(); // Ref for the health bar

  const curve = useMemo(() => {
    const curvePoints = points.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(curvePoints);
  }, [points]);

  // Generate a random delay between 0 and 5000 ms (0 to 5 seconds)
  const randomDelay = useMemo(() => Math.floor(Math.random() * 5000), []);

  // React-Spring animation based on the progress along the curve
  const { progress } = useSpring({
    from: { progress: 0 },
    to: { progress: 1 }, // progress goes from 0 to 1
    config: { duration, tension: 180, friction: 12 }, // Duration in milliseconds
    delay: spawndelay ?? randomDelay, // Add the random delay
    reset: true,
    loop: true, // Loops the animation
  });

  // Use `useFrame` to update the zombie's position along the curve
  useFrame(() => {
    if (ref.current) return;

    const t = progress.get(); // Get progress from spring (0 to 1)
    // Get the curve length mapping
    const u = curve.getUtoTmapping(t); // Map uniform progress to curve parameter space
    // Get the position and tangent at the mapped value `u`
    const position = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);

    ref.current.position.copy(position);

    const lookAtPoint = position.clone().add(tangent);
    ref.current.lookAt(lookAtPoint);

    // Update the health bar position to follow the model
    if (healthbar && healthBarRef.current) {
      healthBarRef.current.position.set(position.x, position.y + 3, position.z); // Above the model
    }
  });

  return (
    <>
      <animated.group ref={ref}>{component}</animated.group>
      {healthbar && (
        <group ref={healthBarRef}>
          <Healthbar health={component.props.health} position={[0, 0, 0]} />
        </group>
      )}
    </>
  );
}

export default AnimatedModel;
