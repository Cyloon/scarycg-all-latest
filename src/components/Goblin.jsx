/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 goblin.gltf --transform 
Files: goblin.gltf [313.26KB] > D:\Daniel\Programming projects\React Three Fiber - Scary Challange Game\r3f-rapier-scarycg\public\models\goblin-transformed.glb [51.94KB] (83%)
*/

import { useEffect, useMemo, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

function Goblin(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/goblin-transformed.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    actions["Attack"].play();
    actions["Attack"].timeScale = 0.05;
    actions["Walk"].play();
    // actions["Walk"].timeScale = 1.0;
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <primitive object={nodes.Root} />
        <skinnedMesh
          name="Goblin"
          geometry={nodes.Goblin.geometry}
          material={materials.Atlas}
          skeleton={nodes.Goblin.skeleton}
          castShadow
        />
      </group>
    </group>
  );
}

useGLTF.preload("./models/goblin-transformed.glb");

export default Goblin;
