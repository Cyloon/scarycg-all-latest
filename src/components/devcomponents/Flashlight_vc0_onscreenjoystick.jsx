import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import { Vector3 } from "three";
import { useSpring, animated } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import FlashlightModel from "./Flashlightmodel";

function Joystick({ position, onMove }) {
  const [active, setActive] = useState(false);
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ active, movement: [mx, my], cancel }) => {
      if (active && (Math.abs(mx) > 50 || Math.abs(my) > 50)) cancel();
      setActive(active);
      api.start({ x: active ? mx : 0, y: active ? my : 0, immediate: active });
      onMove(mx / 50, -my / 50);
    },
    { bounds: { left: -50, right: 50, top: -50, bottom: 50 } },
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: position[0],
          bottom: position[1],
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          touchAction: "none",
        }}
        {...bind()}
      >
        <animated.div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: active ? "#ffffff" : "#cccccc",
            transform: x.to((x) => `translate3d(${x}px, ${y.get()}px, 0)`),
          }}
        />
      </div>
    </>
  );
}

function Flashlight() {
  const lightRef = useRef();
  const targetRef = useRef(new Vector3());
  const { camera } = useThree();

  const [spotlightAngle, setSpotlightAngle] = useState(0.5);
  const [lightPosition, setLightPosition] = useState([0, 0.9, 24]);

  const MIN_ANGLE = Math.PI / 16;
  const MAX_ANGLE = Math.PI / 4;

  useFrame(() => {
    if (lightRef.current && lightRef.current.target) {
      lightRef.current.target.position.copy(targetRef.current);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  const handleJoystickMove = (leftX, leftY, rightX, rightY) => {
    // Move light
    const moveX = (leftX + rightX) / 2;
    const moveY = (leftY + rightY) / 2;
    setLightPosition((prev) => [
      prev[0] + moveX * 0.1,
      prev[1] + moveY * 0.1,
      prev[2],
    ]);

    // Adjust angle
    const angleChange = (rightX - leftX) * 0.01;
    setSpotlightAngle((prev) =>
      THREE.MathUtils.clamp(prev + angleChange, MIN_ANGLE, MAX_ANGLE),
    );

    // Update target
    const targetDistance = 10;
    targetRef.current.set(
      lightPosition[0] + moveX * targetDistance,
      lightPosition[1] + moveY * targetDistance,
      lightPosition[2] - targetDistance,
    );
  };

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => document.removeEventListener("touchmove", preventDefault);
  }, []);

  return (
    <>
      <SpotLight
        castShadow
        ref={lightRef}
        position={lightPosition}
        intensity={3}
        angle={spotlightAngle}
        penumbra={0.2}
        distance={40}
        attenuation={40}
        anglePower={5}
        radiusTop={0.12}
        radiusBottom={spotlightAngle * 20}
      />
      <FlashlightModel position={lightPosition} lightRef={lightRef} />
      <Joystick
        position={["20px", "20px"]}
        onMove={(x, y) => handleJoystickMove(x, y, 0, 0)}
      />
      <Joystick
        position={["right", "20px"]}
        onMove={(x, y) => handleJoystickMove(0, 0, x, y)}
      />
    </>
  );
}

export default Flashlight;
