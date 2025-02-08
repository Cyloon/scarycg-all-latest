import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import AnimatedModel from "../AnimateModel";

export function BaseMonster({
  id,
  modelPath,
  initialHealth = 100,
  monsterConfig,
  children,
}) {
  const group = useRef();
  const [health, setHealth] = useState(initialHealth);
  const [currentState, setCurrentState] = useState("WALK");
  const { scene, animations } = useGLTF(modelPath);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const handleDamage = useCallback(
    (amount) => {
      setHealth((prev) => {
        const newHealth = Math.max(0, prev - amount);
        if (newHealth === 0 && currentState !== "DEATH") {
          setCurrentState("DEATH");
        }
        return newHealth;
      });
    },
    [currentState]
  );

  useEffect(() => {
    if (group.current) {
      group.current.userData = {
        type: "enemy",
        id,
        health,
        handleDamage,
        monsterType: monsterConfig.type,
      };
    }
  }, [id, health, handleDamage, monsterConfig.type]);

  return (
    <group ref={group}>
      <AnimatedModel
        state={currentState}
        points={
          monsterConfig.pathPoints || [
            [0, 0, 0],
            [10, 0, 0],
          ]
        }
      >
        {children({ nodes, materials, health })}
      </AnimatedModel>
    </group>
  );
}
