import React, { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, useHelper, Html } from "@react-three/drei";
import { Vector3, Raycaster, Vector2 } from "three";
import { useGesture } from "@use-gesture/react";
import { useEffect } from "react";
import FlashlightModel from "./Flashlightmodel";
import * as THREE from "three";
import { useGameStore } from "../stores/gameStore";
import { a } from "@react-spring/three";

const SPOTLIGHT_CONFIG = {
  MIN_ANGLE: Math.PI / 160,
  MAX_ANGLE: Math.PI / 12,
  DEFAULT_ANGLE: 0.05,
  DAMAGE_CHECK_INTERVAL: 100,
  RANDOM_POINTS: 5,
};

function Flashlight() {
  const { flashlightState, updateFlashlight, addScore, isPaused } =
    useGameStore();

  const { angle, bottomRadius, intensity } = flashlightState;

  const lightRef = useRef(); // Spotlight reference
  const targetRef = useRef(new Vector3()); // Spotlight target reference
  const raycasterRef = useRef(new Raycaster());

  const planeRef = useRef();

  // Spotlight angle state
  const [spotlightAngle, setSpotlightAngle] = useState(
    SPOTLIGHT_CONFIG.DEFAULT_ANGLE
  ); // Default to mid-range
  //const [bottomRadius, setBottomRadius] = useState(1);

  const { camera, size, pointer, scene } = useThree(); // Get camera and viewport size
  //const { addScore } = useGameStore();

  const generateRandomPointsInCone = useMemo(
    () => (numPoints, radius) => {
      return Array.from({ length: numPoints }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        return new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      });
    },
    []
  );

  const checkForEnemyHits = () => {
    if (!lightRef.current || !scene) return;

    const lightPosition = lightRef.current.position;
    const randomPoints = generateRandomPointsInCone(
      SPOTLIGHT_CONFIG.RANDOM_POINTS,
      bottomRadius
    );

    randomPoints.forEach((point) => {
      const direction = point.clone().sub(lightPosition).normalize();
      raycasterRef.current.set(lightPosition, direction);

      const intersects = raycasterRef.current.intersectObjects(
        scene.children,
        true
      );

      const enemyHit = intersects.find(
        (hit) => hit.object.userData.type === "enemy"
      );

      if (enemyHit) {
        enemyHit.object.userData.handleDamage?.(1);
        addScore(1);
      }
    });
  };

  function SpotlightController() {
    // Set bounds for the spotlight angle in radians
    const MIN_ANGLE = Math.PI / 160; // Minimum angle in radians
    const MAX_ANGLE = Math.PI / 12; // Maximum angle in radians

    // Calculate and set the new radius based on the angle
    const updateRadius = (newAngle) => {
      const calculatedRadius = Math.tan(newAngle) * 35;
      //setBottomRadius(calculatedRadius);
      updateFlashlight({ angle: newAngle, bottomRadius: calculatedRadius });

      if (lightRef.current) {
        lightRef.current.radiusBottom = calculatedRadius; // Update the radiusBottom on the spotlight
      }
    };

    const initialAngleRef = useRef(spotlightAngle);

    const bind = useGesture(
      {
        onWheel: ({ delta: [_, dy] }) => {
          const delta = dy * -0.001;
          updateSpotlightAngle(delta);
        },

        onPinchStart: () => {
          initialAngleRef.current = spotlightAngle;
        },
        onPinch: ({ offset: [d], event }) => {
          event.preventDefault();

          const scale = d;
          const delta = (scale - 1) * 0.05;

          const newAngle = THREE.MathUtils.clamp(
            initialAngleRef.current + delta,
            SPOTLIGHT_CONFIG.MIN_ANGLE,
            SPOTLIGHT_CONFIG.MAX_ANGLE
          );

          setSpotlightAngle(newAngle);
          updateRadius(newAngle);
        },
      },
      {
        target: window,
        eventOptions: { passive: false },
        pinch: { distanceBounds: { min: 0, max: 1000 }, rubberband: true },
      }
    );

    const updateSpotlightAngle = (delta) => {
      const newAngle = THREE.MathUtils.clamp(
        spotlightAngle + delta,
        SPOTLIGHT_CONFIG.MIN_ANGLE,
        SPOTLIGHT_CONFIG.MAX_ANGLE
      );
      setSpotlightAngle(newAngle);
      updateRadius(newAngle);
    };

    useEffect(() => {
      const preventDefaultTouch = (e) => e.preventDefault();
      document.addEventListener("touchmove", preventDefaultTouch, {
        passive: false,
      });
      document.addEventListener("gesturestart", preventDefaultTouch);
      document.addEventListener("gesturechange", preventDefaultTouch);

      return () => {
        document.removeEventListener("touchmove", preventDefaultTouch);
        document.removeEventListener("gesturestart", preventDefaultTouch);
        document.removeEventListener("gesturechange", preventDefaultTouch);
      };
    }, []);

    return (
      <div
        {...bind()}
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    );
  }

  // Gesture handler
  /* useGesture(
      {
        onWheel: ({ event }) => {
          const delta = -event.deltaY * 0.002; // Invert delta for upward scroll to increase angle
          const newAngle = THREE.MathUtils.clamp(
            spotlightAngle + delta,
            MIN_ANGLE,
            MAX_ANGLE
          );

          setSpotlightAngle(newAngle);
          updateRadius(newAngle);
        },

        onDrag: ({ offset: [x, y] }) => {
          api.start({ x, y });

          // Set the position of the lightRef
          if (lightRef.current) {
            lightRef.current.position.set(x, y, -5);
          }
        },

        onPinch: ({ offset: [pinchScale] }) => {
          api.start({ pinchScale });
          const delta = (pinchScale - 1) * 0.1; // Adjust pinch sensitivity
          const newAngle = THREE.MathUtils.clamp(
            spotlightAngle + delta,
            MIN_ANGLE,
            MAX_ANGLE
          );

          setSpotlightAngle(newAngle);
          updateRadius(newAngle);
        },
      },
      {
        target: window, // Listen on the window object
        eventOptions: { passive: false }, // Prevent default touch behavior
        drag: { from: () => [style.x.get(), style.y.get()] },
        pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true },
      }
    );

    // Ensure the radiusBottom is set on initial mount based on the starting angle
    useEffect(() => {
      updateRadius(spotlightAngle);
    }, []);

    return null; // This component does not render anything
  } */

  useEffect(() => {
    const Interval = setInterval(() => {
      checkForEnemyHits, SPOTLIGHT_CONFIG.DAMAGE_CHECK_INTERVAL;
    });
    return () => clearInterval(Interval);
  }, [bottomRadius]);

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
