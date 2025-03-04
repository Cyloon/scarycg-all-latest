/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 skeleton.gltf --transform 
Files: skeleton.gltf [433.61KB] > D:\Daniel\Programming projects\React Three Fiber - Scary Challange Game\r3f-rapier-scarycg\public\models\skeleton-transformed.glb [56.69KB] (87%)
*/

import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useEffect, useMemo, useRef } from "react";

function Skeleton(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/skeleton-transformed.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["Attack"].play();
    //actions["Attack"].timeScale = 1.5;
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
          receiveShadow
        />
      </group>
    </group>
  );
}

useGLTF.preload("./models/skeleton-transformed.glb");

export default Skeleton;
