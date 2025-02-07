import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, useHelper, Html } from "@react-three/drei";
import { Vector3, Raycaster, Vector2 } from "three";
import { useGesture } from "@use-gesture/react";
import { useEffect } from "react";
import FlashlightModel from "./Flashlightmodel";
import * as THREE from "three";

function Flashlight() {
  /* useEffect(() => {
    const handler = (e) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []); */

  const lightRef = useRef(); // Spotlight reference
  const targetRef = useRef(new Vector3()); // Spotlight target reference
  const { camera, size, pointer } = useThree(); // Get camera and viewport size
  const planeRef = useRef();

  // Spotlight angle state
  const [spotlightAngle, setSpotlightAngle] = useState(0.05); // Default to mid-range
  const [bottomRadius, setBottomRadius] = useState(1);

  useFrame(() => {
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

  function SpotlightController() {
    // Set bounds for the spotlight angle in radians
    const MIN_ANGLE = Math.PI / 160; // Minimum angle in radians
    const MAX_ANGLE = Math.PI / 12; // Maximum angle in radians

    // Calculate and set the new radius based on the angle
    const updateRadius = (newAngle) => {
      const calculatedRadius = Math.tan(newAngle) * 35;
      setBottomRadius(calculatedRadius);

      if (lightRef.current) {
        lightRef.current.radiusBottom = calculatedRadius; // Update the radiusBottom on the spotlight
      }
    };

    // Gesture handler
    useGesture(
      {
        onWheel: ({ event }) => {
          const delta = -event.deltaY * 0.002; // Invert delta for upward scroll to increase angle
          const newAngle = THREE.MathUtils.clamp(
            spotlightAngle + delta,
            MIN_ANGLE,
            MAX_ANGLE,
          );

          setSpotlightAngle(newAngle);
          updateRadius(newAngle);
        },

        onPinch: ({ offset: [pinchScale] }) => {
          const delta = (pinchScale - 1) * 0.1; // Adjust pinch sensitivity
          const newAngle = THREE.MathUtils.clamp(
            spotlightAngle + delta,
            MIN_ANGLE,
            MAX_ANGLE,
          );

          setSpotlightAngle(newAngle);
          updateRadius(newAngle);
        },
      },
      {
        target: window, // Listen on the window object
        eventOptions: { passive: false }, // Prevent default touch behavior
      },
    );

    // Ensure the radiusBottom is set on initial mount based on the starting angle
    useEffect(() => {
      updateRadius(spotlightAngle);
    }, []);

    return null; // This component does not render anything
  }

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
        position={[0, 0, -5]} // Place plane in front of the camera
        rotation={[0, 0, 0]} // Facing the camera
      >
        <planeGeometry args={[size.width, size.height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <FlashlightModel position={[0, 0.9, 24]} lightRef={lightRef} />
    </>
  );
}

export default Flashlight;
