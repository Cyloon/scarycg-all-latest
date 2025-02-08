import { useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";

export function useSpotlightControls({
  spotlightAngle,
  updateFlashlight,
  isPaused,
  config,
}) {
  const initialAngleRef = useRef(spotlightAngle);

  // Calculate and set the new radius based on the angle
  const updateRadius = (newAngle) => {
    const calculatedRadius = Math.tan(newAngle) * 35;
    updateFlashlight({ angle: newAngle, bottomRadius: calculatedRadius });
  };

  const updateSpotlightAngle = (delta) => {
    const newAngle = THREE.MathUtils.clamp(
      spotlightAngle + delta,
      config.MIN_ANGLE,
      config.MAX_ANGLE
    );
    updateRadius(newAngle);
  };

  const bind = useGesture(
    {
      onWheel: ({ delta: [_, dy] }) => {
        if (isPaused) return;
        const delta = dy * -0.0005;
        updateSpotlightAngle(delta);
      },

      onPinchStart: () => {
        if (isPaused) return;
        initialAngleRef.current = spotlightAngle;
      },
      onPinch: ({ offset: [d], event }) => {
        if (isPaused) return;
        event.preventDefault();

        const scale = d;
        const delta = (scale - 1) * 0.05;

        const newAngle = THREE.MathUtils.clamp(
          initialAngleRef.current + delta,
          config.MIN_ANGLE,
          config.MAX_ANGLE
        );

        updateRadius(newAngle);
      },
    },
    {
      target: window,
      eventOptions: { passive: false },
      pinch: { distanceBounds: { min: 0, max: 1000 }, rubberband: true },
    }
  );

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

  return { bind, updateRadius, updateSpotlightAngle };
}

//<div {...bind()} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }} />
