/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.0 .\Bat2.glb --transform 
Files: .\Bat2.glb [108.7KB] > D:\Daniel\Programming projects\React Three Fiber - Scary Challange Game\r3f-rapier-scarycg\public\models\Bat2-transformed.glb [70.1KB] (36%)
*/

import { useEffect, useRef, useMemo } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

function Bat2(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Bat2-transformed.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["Flying"].play();
    //actions["Flying"].timeScale = 40;
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="MonsterArmature">
          <primitive object={nodes.Body} />
          <primitive object={nodes.Head} />
        </group>
        <group name="Bat002">
          <skinnedMesh
            name="Cube000"
            geometry={nodes.Cube000.geometry}
            material={materials.Texture}
            skeleton={nodes.Cube000.skeleton}
          />
          <skinnedMesh
            name="Cube000_1"
            geometry={nodes.Cube000_1.geometry}
            material={materials["Shader.Grey"]}
            skeleton={nodes.Cube000_1.skeleton}
          />
          <skinnedMesh
            name="Cube000_2"
            geometry={nodes.Cube000_2.geometry}
            material={materials["Shader.darkerGrey"]}
            skeleton={nodes.Cube000_2.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./models/Bat2-transformed.glb");

export default Bat2;
