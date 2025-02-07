import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, useHelper } from "@react-three/drei";
import { Vector3, Raycaster } from "three";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";
import FlashlightModel from "./Flashlightmodel";

function Flashlight() {
  const lightRef = useRef();
  const targetRef = useRef(new Vector3());
  const { camera, size, pointer } = useThree();
  const planeRef = useRef();

  const [spotlightAngle, setSpotlightAngle] = useState(0.05);
  const [bottomRadius, setBottomRadius] = useState(1);

  const MIN_ANGLE = Math.PI / 160;
  const MAX_ANGLE = Math.PI / 12;

  const updateRadius = (newAngle) => {
    const calculatedRadius = Math.tan(newAngle) * 35;
    setBottomRadius(calculatedRadius);
    if (lightRef.current) {
      lightRef.current.radiusBottom = calculatedRadius;
    }
  };

  useFrame(() => {
    const ray = new Raycaster();
    ray.setFromCamera(pointer, camera);
    const intersects = ray.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      targetRef.current.copy(intersects[0].point);
      if (lightRef.current && lightRef.current.target) {
        lightRef.current.target.position.copy(targetRef.current);
        lightRef.current.target.updateMatrixWorld();
      }
    }
  });

  const bind = () =>
    useGesture(
      {
        onDrag: ({ delta: [dx, dy] }) => {
          if (lightRef.current && lightRef.current.target) {
            lightRef.current.target.position.x += dx * 0.01;
            lightRef.current.target.position.y -= dy * 0.01;
            lightRef.current.target.updateMatrixWorld();
          }
        },
        onPinch: ({ delta: [d] }) => {
          const newAngle = THREE.MathUtils.clamp(
            spotlightAngle + d * 0.0005,
            MIN_ANGLE,
            MAX_ANGLE,
          );
          setSpotlightAngle(newAngle);
          updateRadius(newAngle);
        },
      },
      {
        target: window,
        eventOptions: { passive: false },
      },
    );

  useEffect(() => {
    updateRadius(spotlightAngle);
    const handler = (e) => e.preventDefault();
    document.addEventListener("touchmove", handler, { passive: false });
    return () => document.removeEventListener("touchmove", handler);
  }, []);

  // Helper to visualize the spotlight (comment out in production)
  // useHelper(lightRef, THREE.SpotLightHelper, 'cyan')

  return (
    <>
      <SpotLight
        castShadow
        ref={lightRef}
        position={[0, 0.9, 24]}
        intensity={3}
        angle={spotlightAngle}
        penumbra={0.2}
        distance={40}
        attenuation={40}
        anglePower={0.0}
        radiusBottom={bottomRadius}
        radiusTop={0.12}
        decay={0}
        opacity={0.08}
      />
      <mesh
        ref={planeRef}
        visible={false}
        position={[0, 0, -5]}
        rotation={[0, 0, 0]}
        {...bind()}
      >
        <planeGeometry args={[size.width, size.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <FlashlightModel position={[0, 0.9, 24]} lightRef={lightRef} />
    </>
  );
}

export default Flashlight;
