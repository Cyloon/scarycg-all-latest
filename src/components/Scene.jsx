import {
  OrbitControls,
  Stars,
  Float,
  Cloud,
  Clouds,
  Text,
} from "@react-three/drei";
import Moon from "./Moon";
import Moonlight from "./Moonlight";
//import Flashlight from "./Flashlight";

import Zombie from "./Zombie";
import Skeleton20 from "./Skeleton20";
//import SkeletonNC from "./SkeletonNC";
import Goblin from "./Goblin";
import Demon from "./Demon";
import Bat2 from "./Bat2";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import CurvePath from "./CurvePath";
import AnimatedModel from "./AnimateModel";
import Flashlight from "./Flashlight";
import Halloweenworld from "./Halloweenworld";
import { Spider } from "./Spider";
import RotatingStars from "./RotatingStars";
import { useState } from "react";
import Zombieprespos from "./Zombieprespos";
import { MonsterSpawner } from "./MonsterSpawner";

//import * as THREE from "three";

export function Scene() {
  const scaryfog = useRef();
  const startTime = useRef(Date.now()); //Date.now() is in milliseconds
  //const enemies = useGameStore((state) => state.enemies);

  const points = [
    [
      [-6, 0, -9], // Starting point Left 4
      [-1, 0, -6], // Control point 1
      [-0.15, 0, 0], // Middle point
      [-0.1, 0, 10], // Control point 2
      [-0.05, 0, 17], // Control point 3
      [0, 0, 23], // Ending point
    ],
    [
      [6, 0, -9], // Starting point Right 4
      [1, 0, -6], // Control point 1
      [0.15, 0, 0], // Middle point
      [0.1, 0, 10], // Control point 2
      [0.05, 0, 17], // Control point 3
      [0, 0, 23], // Ending point
    ],
    [
      [-6, 0, 0], // Starting point Left 3
      [-1, 0, 1], // Control point 1
      [-0.8, 0, 5], // Middle point
      [-0.5, 0, 10], // Control point 2
      [-0.4, 0, 17], // Control point 3
      [-0, 0, 23], // Ending point
    ],
    [
      [6, 0, 0], // Starting point Right 3
      [1, 0, 1], // Control point 1
      [0.8, 0, 5], // Middle point
      [0.5, 0, 10], // Control point 2
      [0.4, 0, 17], // Control point 3
      [0, 0, 27], // Ending point
    ],
    [
      [-6, 0, 5], // Starting point Left 2
      [-1.5, 0, 6], // Control point 1
      [-0.8, 0, 10], // Middle point
      [-0.5, 0, 17], // Control point 2
      [-0, 0, 23], // Ending point
    ],
    [
      [6, 0, 5], // Starting point Right 2
      [1.5, 0, 6], // Control point 1
      [0.8, 0, 10], // Middle point
      [0.5, 0, 17], // Control point 2
      [0, 0, 23], // Ending point
    ],
    [
      [-5, 0, 12], // Starting point Left 1
      [-2, 0, 13], // Control point 1
      [-1.5, 0, 14], // Middle point
      [-0.9, 0, 17], // Control point 2
      [-0, 0, 23], // Ending point]
    ],
    [
      [5, 0, 12], // Starting point Right 1
      [2, 0, 13], // Control point 1
      [1.5, 0, 14], // Middle point
      [0.9, 0, 17], // Control point 2
      [0, 0, 23], // Ending point]
    ],
    [
      [10, 0, 0], // Starting point Right Spider
      [1, 0, 1], // Control point 1
      [0.8, 0, 5], // Middle point
      [-10, 0, 0], // Ending point
    ],
    [
      [-5, 0, 12], // Starting point Left 1
      [-2, 0, 13], // Control point 1
      [-0.5, 0, 12],
      [0, 0, 14],
      [1, 0, 13],
      [7, 0, 14], // Middle point
    ],
  ];

  useFrame(() => {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000; // Convert to seconds
    const totalTime = 60;
    const distance = 10;
    // Calculate the progress ratio based on elapsed time
    const progress = (elapsedTime % totalTime) / totalTime;
    // Move the object from -distance/2 to distance/2 and back
    scaryfog.current.position.x =
      Math.sin(progress * Math.PI * 2) * (distance / 2);
  });

  return (
    <>
      <OrbitControls
        target={[0, 4, -10]}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      <RotatingStars />
      <Clouds color="#fff" opacity={0.5}>
        <meshBasicMaterial color="#fff" opacity={0.5} />
        <Cloud
          castShadow={false}
          ref={scaryfog}
          bounds={[7, 0, 5]}
          color="#eed0d0"
          seed={2}
          position={[0, 0, 20]}
          opacity={0.8}
          speed={0.1}
          segments={10}
        />
      </Clouds>
      <ambientLight />
      <pointLight position={[0, 10, -10]} />
      <pointLight
        intensity={6}
        position={[4.6, 17.5, -8.5]}
        distance={2}
        decay={3}
      />
      <Halloweenworld />
      <Moon />
      <Moonlight />
      <Flashlight />
      <MonsterSpawner />

      {/* {enemies.map((enemy, index) => (
        <AnimatedModel
          key={enemy.id}
          //component={<Zombie id={enemy.id} initialHealth={100} />}
          //points={points[6]}
          healthbar={true}
        ></AnimatedModel>
      ))} */}
      {/* 
      <Float speed={3} floatIntensity={0.3} floatingRange={10}>
        <Bat2 position={[0, 4, 4]} />
      </Float>
      */}
      {/* <AnimatedModel
        component={<Skeleton20 />}
        points={points[1]}
        healthbar={true}
      />
      <AnimatedModel
        component={<Goblin />}
        points={points[5]}
        healthbar={true}
      />
      <AnimatedModel
        component={<Demon />}
        points={points[7]}
        healthbar={true}
      /> */}
      {/* 
      <AnimatedModel
        component={<Spider />}
        points={points[8]}
        spawndelay={30000}
      />
      */}
      {/* 
      <AnimatedModel
        component={<Spider scale={0.15} timeScale={2} />}
        points={points[9]}
        spawndelay={20000}
      />
      */}
      {/* 
      <Text position={[0, 10, 9]}>NOT</Text>
      <Text position={[0, 9, 9]}>WORKING</Text>
      <Text position={[0, 8, 9]}>VERSION,</Text>
      <Text position={[0, 7, 9]}>DEV</Text>
      <Text position={[0, 6, 9]}>IN PROGRESS</Text>
      */}
      {/* <Skeleton20 position={[2, 0, 18]} />
      <Goblin position={[2, 0, 9]} />
      <Demon position={[-1, 0, 3]} />
      <Zombie position={[-1, 0, 22]} /> */}
      {/* <CurvePath /> */}
    </>
  );
}

/* <Zombie position={[0, 0, -1]} />
      <Skeleton position={[0.5, 0, 4]} />
      <SkeletonNC position={[-0.5, 0, 4]} />
      <Goblin position={[1, 0, 2]} />
      <Demon position={[-1.5, 0, 2]} /> */
