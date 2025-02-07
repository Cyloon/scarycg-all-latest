import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SpotLight, useHelper, Html } from "@react-three/drei";
import { Vector3, Raycaster, Vector2 } from "three";
import { useGesture } from "@use-gesture/react";
import { useEffect } from "react";
import * as THREE from "three";
import { useSpring } from "@react-spring/three";

const lightRef = useRef(); // Spotlight reference

// Spotlight angle state
const [spotlightAngle, setSpotlightAngle] = useState(0.05); // Default to mid-range
const [bottomRadius, setBottomRadius] = useState(1);

function CircleController() {
  // Set up spring animation for position and scale (size)
  const [style, api] = useSpring(() => ({
    x: lightRef.current.x,
    y: lightRef.current.y,
    scale: 1, // Scale starts at 1 (normal size)
  }));
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
          MAX_ANGLE,
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
    },
  );

  // Ensure the radiusBottom is set on initial mount based on the starting angle
  useEffect(() => {
    updateRadius(spotlightAngle);
  }, []);

  return null; // This component does not render anything
}
