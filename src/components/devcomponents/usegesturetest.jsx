import React, { useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

const MovableResizableCircle = () => {
  // Initialize the spring animation values for position (x, y) and scale (size)
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1, // Scale controls the size of the circle
  }));

  // Use a ref to track the element (in this case, the circle)
  const circleRef = useRef(null);

  // Set up gestures for drag (move) and pinch (resize)
  useGesture(
    {
      // Handle dragging (moving the circle)
      onDrag: ({ offset: [x, y] }) => {
        // Update the position (x, y) of the circle
        api.start({ x, y });
      },

      // Handle pinch (resizing the circle)
      onPinch: ({ offset: [scale] }) => {
        // Update the scale of the circle
        api.start({ scale });
      },
    },
    {
      // Apply gesture handling to the circle element
      target: circleRef,
      // Optional configuration to make dragging more intuitive
      drag: { from: () => [style.x.get(), style.y.get()] },
      // Optional configuration to limit the scaling bounds
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true }, // Scale between 0.5x and 2x size
    },
  );

  return (
    <div
      className="canvas"
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      {/* Animated circle, controlled by the gesture */}
      <animated.div
        ref={circleRef} // Reference to the circle for gesture control
        style={{
          ...style, // Apply animated x, y, and scale values
          width: 100, // Fixed width (this will scale with the `scale` value)
          height: 100, // Fixed height
          borderRadius: "50%", // Make it a circle
          backgroundColor: "lightblue", // Just to visualize it
          position: "absolute", // Absolutely position the circle within the container
        }}
      />
    </div>
  );
};

export default MovableResizableCircle;
