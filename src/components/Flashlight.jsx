import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, useHelper, Html } from "@react-three/drei";
import { Vector3, Raycaster, Vector2 } from "three";
import FlashlightModel from "./Flashlightmodel";
import * as THREE from "three";
import { useGameStore } from "../stores/gameStore";
import { useSpotlightControls } from "../hooks/useSpotlightControls";
import { useEnemyDetection } from "../hooks/useEnemyDetection";

function Flashlight() {
  const {
    flashlightState,
    updateFlashlight,
    addScore,
    isPaused,
    getSpotlightConfig,
    getPlaneConfig,
  } = useGameStore();

  const { angle: spotlightAngle, bottomRadius } = flashlightState;
  const config = useMemo(() => getSpotlightConfig(), []);

  const spotlightProps = useMemo(
    () => ({
      castShadow: true,
      intensity: 3,
      angle: flashlightState.angle,
      penumbra: 0.2,
      distance: 40,
      attenuation: 40,
      anglePower: 0.0,
      radiusBottom: bottomRadius,
      radiusTop: 0.12,
      decay: 0,
      opacity: 0.08,
    }),
    [flashlightState.angle, bottomRadius]
  );

  const lightRef = useRef(); // Spotlight reference
  const targetRef = useRef(new Vector3()); // Spotlight target reference
  //const raycasterRef = useRef(new Raycaster());
  const planeRef = useRef();

  const { size, scene } = useThree(); // Get camera and viewport size

  const pointer = useThree((state) => state.pointer);
  const camera = useThree((state) => state.camera);

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
      <Html>
        <div
          {...bind}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </Html>
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
    if (!planeRef.current || !lightRef.current || isPaused) return;

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
        ref={lightRef}
        {...spotlightProps}
        position={config.SPOTLIGHT_POSITION}
      />
      <SpotlightController />

      {/* Invisible plane for detecting pointer movement */}
      <mesh
        ref={planeRef}
        visible={false}
        position={config.PLANE_POSITION} // Place plane in front of the camera
        rotation={[0, 0, 0]} // Facing the camera
      >
        <planeGeometry args={[size.width, size.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <FlashlightModel
        position={config.SPOTLIGHT_POSITION}
        lightRef={lightRef}
      />
    </>
  );
}

export default Flashlight;
