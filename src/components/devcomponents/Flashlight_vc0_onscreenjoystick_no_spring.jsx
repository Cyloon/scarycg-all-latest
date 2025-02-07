import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import { Vector3 } from "three";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { createPortal } from "react-dom";
import FlashlightModel from "./Flashlightmodel";

function Joystick({ position, onMove }) {
  const [active, setActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  const bind = useDrag(
    ({ active, movement: [mx, my], cancel }) => {
      if (active && (Math.abs(mx) > 50 || Math.abs(my) > 50)) cancel();
      setActive(active);
      const newX = active ? mx : 0;
      const newY = active ? my : 0;
      setJoystickPosition({ x: newX, y: newY });
      onMove(newX / 50, -newY / 50);
    },
    { bounds: { left: -50, right: 50, top: -50, bottom: 50 } },
  );

  return (
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
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: active ? "#ffffff" : "#cccccc",
          transform: `translate3d(${joystickPosition.x}px, ${joystickPosition.y}px, 0)`,
        }}
      />
    </div>
  );
}

function FlashlightScene({ joystickState }) {
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

    // Handle joystick input
    const { left, right } = joystickState;
    const moveX = (left[0] + right[0]) / 2;
    const moveY = (left[1] + right[1]) / 2;

    setLightPosition((prev) => [
      prev[0] + moveX * 0.1,
      prev[1] + moveY * 0.1,
      prev[2],
    ]);

    const angleChange = (right[0] - left[0]) * 0.01;
    setSpotlightAngle((prev) =>
      THREE.MathUtils.clamp(prev + angleChange, MIN_ANGLE, MAX_ANGLE),
    );

    const targetDistance = 10;
    targetRef.current.set(
      lightPosition[0] + moveX * targetDistance,
      lightPosition[1] + moveY * targetDistance,
      lightPosition[2] - targetDistance,
    );
  });

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
    </>
  );
}

function Flashlight() {
  const [joystickState, setJoystickState] = useState({
    left: [0, 0],
    right: [0, 0],
  });

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => document.removeEventListener("touchmove", preventDefault);
  }, []);

  const handleJoystickMove = (side) => (x, y) => {
    setJoystickState((prev) => ({
      ...prev,
      [side]: [x, y],
    }));
  };

  return (
    <>
      <FlashlightScene joystickState={joystickState} />
      {createPortal(
        <>
          <Joystick
            position={["20px", "20px"]}
            onMove={handleJoystickMove("left")}
          />
          <Joystick
            position={["right", "20px"]}
            onMove={handleJoystickMove("right")}
          />
        </>,
        document.body,
      )}
    </>
  );
}

export default Flashlight;
