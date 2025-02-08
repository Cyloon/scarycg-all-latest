import React, { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, useHelper, Html } from "@react-three/drei";
import { Vector3, Raycaster, Vector2 } from "three";
import { useGesture } from "@use-gesture/react";
import { useEffect } from "react";
import FlashlightModel from "./Flashlightmodel";
import * as THREE from "three";
import { useGameStore } from "../stores/gameStore";
import { useSpotlightControls } from "../hooks/useSpotlightControls";
import { useEnemyDetection } from "../hooks/useEnemyDetection";

const PLANE_POSITION = [0, 0, -5];

function Flashlight() {
  const {
    flashlightState,
    updateFlashlight,
    addScore,
    isPaused,
    getSpotlightConfig,
  } = useGameStore();

  const { angle: spotlightAngle, bottomRadius } = flashlightState;
  const config = getSpotlightConfig();

  const lightRef = useRef(); // Spotlight reference
  const targetRef = useRef(new Vector3()); // Spotlight target reference
  const raycasterRef = useRef(new Raycaster());
  const planeRef = useRef();

  const { camera, size, pointer, scene } = useThree(); // Get camera and viewport size

  const { bind } = useSpotlightControls({
    spotlightAngle,
    updateFlashlight,
    isPaused,
    config,
  });

  const { checkForEnemyHits } = useEnemyDetection({
    lightRef,
    scene,
    isPaused,
    bottomRadius,
    config,
    addScore,
  });

  function SpotlightController() {
    return (
      <div
        {...bind()}
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    );
  }

  useEffect(() => {
    if (isPaused) return;

    const Interval = setInterval(
      checkForEnemyHits,
      config.DAMAGE_CHECK_INTERVAL
    );

    return () => clearInterval(Interval);
  }, [checkForEnemyHits, isPaused, config.DAMAGE_CHECK_INTERVAL]);

  useFrame(() => {
    if (!planeRef.current || !lightRef.current) return;

    const ray = new Raycaster();
    ray.setFromCamera(pointer, camera);
    const intersects = ray.intersectObject(planeRef.current);

    if (intersects.length > 0) {
      targetRef.current.copy(intersects[0].point);

      // Update spotlight target position
      lightRef.current.target.position.copy(targetRef.current);
      lightRef.current.target.updateMatrixWorld();
    }
  });

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
      <SpotlightController />

      {/* Invisible plane for detecting pointer movement */}
      <mesh
        ref={planeRef}
        visible={false}
        position={PLANE_POSITION} // Place plane in front of the camera
        rotation={[0, 0, 0]} // Facing the camera
      >
        <planeGeometry args={[size.width, size.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <FlashlightModel position={config.POSITION} lightRef={lightRef} />
    </>
  );
}

export default Flashlight;
