"use client";

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useCursor, Text } from "@react-three/drei";
import * as THREE from "three";

function RaycastCircle() {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState([0, 0, 0]);
  const [radius, setRadius] = useState(5);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const meshRef = useRef();
  const rayRef = useRef();
  const squareRef = useRef();

  useCursor(hovered);

  const { raycaster, camera, scene } = useThree();

  const cameraPosition = useMemo(() => new THREE.Vector3(0, 0, 27), []);

  const handlePointerMove = useCallback(
    (event) => {
      if (hovered) {
        const { point } = event;
        setPosition([point.x, point.y, 0]);
      }
    },
    [hovered],
  );

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setRadius((prev) => Math.max(0.1, prev - e.deltaY * 0.01));
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useFrame(() => {
    if (meshRef.current && rayRef.current && squareRef.current) {
      // Generate random point within the circle
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      const x = r * Math.cos(angle) + position[0];
      const y = r * Math.sin(angle) + position[1];

      const randomPoint = new THREE.Vector3(x, y, 0);

      // Calculate direction from camera to random point
      const direction = new THREE.Vector3()
        .subVectors(randomPoint, cameraPosition)
        .normalize();

      // Update raycaster
      raycaster.set(cameraPosition, direction);

      // Cast ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Update ray visualization
      if (intersects.length > 0) {
        const points = [cameraPosition, intersects[0].point];
        rayRef.current.geometry.setFromPoints(points);

        // Check if the intersection is with the square
        if (
          intersects.some((intersect) => intersect.object === squareRef.current)
        ) {
          setHits((prev) => prev + 1);
        } else {
          setMisses((prev) => prev + 1);
        }
      }
    }
  });

  return (
    <>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerMove={handlePointerMove}
        >
          <circleGeometry args={[radius, 64]} />
          <meshBasicMaterial
            color={hovered ? "hotpink" : "orange"}
            transparent
            opacity={0.5}
          />
        </mesh>
        <line ref={rayRef}>
          <bufferGeometry />
          <lineBasicMaterial color="red" />
        </line>
      </group>
      <mesh ref={squareRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      <Text position={[-5, 5, 0]} fontSize={0.5} color="white">
        Hits: {hits}
      </Text>
      <Text position={[5, 5, 0]} fontSize={0.5} color="white">
        Misses: {misses}
      </Text>
    </>
  );
}

export default function Component() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 27], fov: 50 }}>
        <RaycastCircle />
        <OrbitControls enableRotate={false} enableZoom={false} />
        <gridHelper args={[100, 100]} position={[0, 0, -0.01]} />
      </Canvas>
    </div>
  );
}
