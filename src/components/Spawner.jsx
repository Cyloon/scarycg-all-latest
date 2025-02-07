import React, { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/three";
import Zombie from "./Zombie";
import Skeleton from "./Skeleton";
import Demon from "./Demon";
import Goblin from "./Goblin"; // Import all the models

const spawnPoints = [
  { x: -10, y: 0, z: -15 },
  { x: 10, y: 0, z: -15 },
  { x: -8, y: 0, z: -8 },
  { x: 8, y: 0, z: -7.5 },
  { x: -7, y: 0, z: -2 },
  { x: 6, y: 0, z: -2 },
  { x: -6, y: 0, z: 6 },
  { x: 6, y: 0, z: 6 },
];

const targetPosition = { x: 0, y: 1, z: 27 };

// Function to randomly select a spawn point
const randomPoint = () =>
  spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

// Function to randomly select a model component
const randomModel = (models) =>
  models[Math.floor(Math.random() * models.length)];

const Spawner = ({ spawnInterval = 1000 }) => {
  const modelComponents = [Zombie, Skeleton, Demon, Goblin]; // List of available model components
  const [spawnPoint, setSpawnPoint] = useState(randomPoint());
  const [ModelComponent, setModelComponent] = useState(() =>
    randomModel(modelComponents),
  ); // Random model
  const [visible, setVisible] = useState(true);

  // Spring animation for moving models to the target
  const [{ position }, setSpring] = useSpring(() => ({
    position: [spawnPoint.x, spawnPoint.y, spawnPoint.z],
    config: { duration: 3000 },
    onRest: () => {
      if (!visible) {
        setVisible(true);
        setSpring({
          position: [spawnPoint.x, spawnPoint.y, spawnPoint.z],
        });
        setSpawnPoint(randomPoint()); // Randomize new spawn point
        setModelComponent(() => randomModel(modelComponents)); // Randomize new model
      }
    },
  }));

  useEffect(() => {
    if (!visible) {
      setSpring({
        position: [targetPosition.x, targetPosition.y, targetPosition.z],
      });
      setTimeout(() => setVisible(true), spawnInterval); // Use the provided spawn interval
    }
  }, [visible, setSpring, spawnInterval]);

  return (
    <animated.mesh position={position}>
      <ModelComponent /> {/* Render the randomly selected model */}
    </animated.mesh>
  );
};

export default Spawner;
