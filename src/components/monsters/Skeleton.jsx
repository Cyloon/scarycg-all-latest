import { BaseMonster } from "./BaseMonster";
import { MONSTERS } from "../../config/monsters";
import { useMemo, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useEffect } from "react";

export function Skeleton({ position, id }) {
  const skeletonConfig = MONSTERS.find((m) => m.type === "skeleton");

  return (
    <BaseMonster
      id={id}
      modelPath={skeletonConfig.model}
      initialHealth={skeletonConfig.baseHealth}
      monsterConfig={skeletonConfig}
    >
      {({ nodes, materials }) => (
        <group>
          <primitive object={nodes.Root} />
          <skinnedMesh
            name="Skeleton"
            geometry={nodes.Skeleton.geometry}
            material={materials.Atlas}
            skeleton={nodes.Skeleton.skeleton}
            castShadow
          />
        </group>
      )}
    </BaseMonster>
  );
}

useGLTF.preload("/Skeleton20.glb");

export default Skeleton;

function Skeletonian(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Skeleton20.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["Attack"].play();
    actions["Attack"].timeScale = 0.05;
    actions["Walk"].play();
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <primitive object={nodes.Root} />
        <skinnedMesh
          name="Skeleton"
          geometry={nodes.Skeleton.geometry}
          material={materials.Atlas}
          skeleton={nodes.Skeleton.skeleton}
          castShadow
        />
      </group>
    </group>
  );
}
