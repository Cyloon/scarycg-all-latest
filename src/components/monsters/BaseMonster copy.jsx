import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useGraph, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useGameStore } from "../stores/gameStore";
import { ANIMATION_STATES, SPEED_THRESHOLDS } from "../../config/monsters";
import AnimatedModel from "../AnimateModel";
import Healthbar from "../Healthbar";

export function BaseMonster({
  id,
  modelPath,
  initialHealth = 100,
  monsterConfig,
  pathPoints,
  onDeath,
  children,
}) {
  const group = useRef();
  const headRef = useRef();
  const [health, setHealth] = useState(initialHealth);
  //const [currentAnimation, setCurrentAnimation] = useState(
  //  monsterConfig.isFlying ? ANIMATION_STATES.FLYING : ANIMATION_STATES.WALK
  //);
  const [currentState, setCurrentState] = useState("WALK");
  const { removeEnemy } = useGameStore();
  const { camera } = useThree();

  const { scene, animations } = useGLTF(modelPath);
  useGLTF.preload(modelPath);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const modelRef = useRef();

  useEffect(() => {
    const headMesh = group.current?.children[0]?.children[2]?.children[0];
    if (headMesh) {
      headRef.current = headMesh;
    }
  }, []);

  const handleDamage = useCallback(
    (amount) => {
      setHealth((prev) => {
        const currentHealth = Math.max(0, prev - amount);
        if (currentHealth === 0 && currentState !== "DEATH") {
          setCurrentState("DEATH");
          onDeath?.(id);
        }
        return currentHealth;
      });
    },
    [currentState, onDeath, id]
  );

  useEffect(() => {
    if (modelRef.current?.actions) {
      Object.values(modelRef.current.actions).forEach((actions) =>
        actions.stop()
      );

      const currentAction =
        modelRef.current.actions[monsterConfig.ANIMATION_STATES[currentState]];
      if (currentAction) {
        currentAction.reset().play();

        if (currentState === "DEATH") {
          currentAction.setLoop(false, 1);
          handleDeath();
        }
      }
    }
  }, [currentState, monsterConfig.ANIMATION_STATES]);

  const handlePositionUpdate = useCallback(
    (position, rotation) => {
      if (headRef.current && currentState !== "DEATH") {
        //update headtracking here
      }
    },
    [currentState]
  );

  /* const playAnimation = (animationName, options = {}) => {
    if (!actions || !actions[monsterConfig.animations[animationName]]) return;

    if (options.stopCurrent) {
      actions[monsterConfig.animations[currentAnimation]]?.stop();
    }

    const action = actions[monsterConfig.animations[animationName]];

    if (options.crossFade && currentAnimation) {
      const current = actions[monsterConfig.animations[currentAnimation]];
      current?.crossFadeTo(action, 0.5, true);
    }

    action.play();

    if (options.timeScale) {
      action.timeScale = options.timeScale;
    }

    if (!options.overlay) {
      setCurrentAnimation(animationName);
    }
  }; */

  /*   useEffect(() => {
    if (monsterConfig.isFlying) {
      playAnimation(ANIMATION_STATES.FLYING);
    } else {
      const speed = monsterConfig.speed;
      if (speed > SPEED_THRESHOLDS.RUN) {
        playAnimation(ANIMATION_STATES.RUN);
      } else {
        playAnimation(ANIMATION_STATES.WALK);
      }
    }
  }, [monsterConfig.speed]);
 */
  /*   useEffect(() => {
    if (health < initialHealth && health > 0 && monsterConfig.animations.hit) {
      playAnimation(ANIMATION_STATES.HIT, {
        overlay: true,
        timeScale: 1,
        duration: 0.5,
      });
    } else if (health <= 0) {
      handleDeath();
    }
  }, [health]);
 */
  useEffect(() => {
    if (group.current) {
      group.current.userData = {
        type: "enemy",
        id,
        health,
        handleDamage,
        canTakeDamage: monsterConfig.canTakeDamage,
        monsterType: monsterConfig.type,
      };
    }
  }, [
    id,
    health,
    handleDamage,
    monsterConfig.canTakeDamage,
    monsterConfig.type,
  ]);

  const handleDeath = () => {
    if (monsterConfig.animations.death) {
      Object.values(actions).forEach((action) => action.stop());

      //playAnimation(ANIMATION_STATES.DEATH, {
      //  stopCurrent: true,
      //  timeScale: 1,
      //});

      const deathAction = actions[monsterConfig.animations.death];
      setTimeout(() => removeEnemy(id), deathAction.duration * 1000);
    } else {
      removeEnemy(id);
    }
  };

  /*   useFrame((state, delta) => {
    if (monsterConfig.isFlying && group.current) {
      const time = state.clock.getElapsedTime();
      const heightRange = monsterConfig.heightRange;
      const baseHeight = (heightRange.max + heightRange.min) / 2;
      const amplitude = (heightRange.max - heightRange.min) / 2;

      group.current.position.y = baseHeight + Math.sin(time) * amplitude;
    }
  }); */

  useFrame(() => {
    if (headRef.current && camera) {
      const directionToCamera = camera.position
        .clone()
        .sub(headRef.current.position);

      headRef.current.lookAt(camera.position);

      const currentRotation = headRef.current.rotation.clone();
      currentRotation.x = Math.max(-0.5, Math.min(0.5, currentRotation.x));
      currentRotation.y = Math.max(-1, Math.min(1, currentRotation.y));

      headRef.current.rotation.copy(currentRotation);
    }
  });

  /*   const handleDamage = useCallback(
    (amount) => {
      if (!monsterConfig.canTakeDamage) return;
      setHealth((prev) => Math.max(0, prev - amount));
    },
    [monsterConfig.canTakeDamage]
  );
 */
  return (
    <group
      ref={groupRef}
      userData={{
        type: "enemy",
        health,
        handleDamage,
        id,
        monsterType: monsterConfig.type,
      }}
    >
      <AnimatedModel
        ref={modelRef}
        points={pathPoints}
        healthbar={true}
        duration={12000 / monsterConfig.speed}
        state={currentState}
        onPositionUpdate={handlePositionUpdate}
      >
        {children({ headRef, health, currentState, setCurrentState })}
      </AnimatedModel>
      <Healthbar health={health} position={current.position} />
    </group>

    /*  <group ref={group} dispose={null}>
      {children({ nodes, materials, actions, headRef, health, setHealth })}
    </group> */
  );
}
