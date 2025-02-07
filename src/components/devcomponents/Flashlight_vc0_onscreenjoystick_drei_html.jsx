import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, Html } from "@react-three/drei";
import { Vector3 } from "three";
import { useSpring, animated } from "@react-spring/web"; // Note: we're using @react-spring/web here
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import FlashlightModel from "./Flashlightmodel";

function Joystick({ position, onMove }) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  const bind = useDrag(
    ({ offset: [x, y], down }) => {
      api.start({ x, y });
      if (down) {
        onMove(x / 50, -y / 50);
      } else {
        api.start({ x: 0, y: 0 });
        onMove(0, 0);
      }
    },
    {
      bounds: { left: -50, right: 50, top: -50, bottom: 50 },
      rubberband: true,
    },
  );

  return (
    <Html position={position} transform occlude>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          touchAction: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...bind()}
      >
        <animated.div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "#ffffff",
            transform: x.to((x) => `translate3d(${x}px, ${y.get()}px, 0)`),
          }}
        />
      </div>
    </Html>
  );
}

function Flashlight() {
  const lightRef = useRef();
  const targetRef = useRef(new Vector3());
  const { size } = useThree();

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
        position={[-size.width / 2 + 70, -size.height / 2 + 70, 0]}
        onMove={(x, y) => handleJoystickMove(x, y, 0, 0)}
      />
      <Joystick
        position={[size.width / 2 - 70, -size.height / 2 + 70, 0]}
        onMove={(x, y) => handleJoystickMove(0, 0, x, y)}
      />
    </>
  );
}

export default Flashlight;
