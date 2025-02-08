import { useEffect } from "react";
import { BaseMonster } from "./BaseMonster";
import { MONSTERS } from "../../config/monsters";

export function Spider({ position, id }) {
  const spiderConfig = MONSTERS.find((m) => m.type === "spider");

  return (
    <BaseMonster
      id={id}
      modelPath={spiderConfig.model}
      initialHealth={spiderConfig.baseHealth}
      monsterConfig={spiderConfig}
    >
      {({ nodes, materials, headRef }) => (
        <group position={position}>
          <skinnedMesh
            name="EnemyMesh"
            geometry={nodes.SpiderMesh.geometry}
            skeleton={nodes.SpiderMesh.skeleton}
            material={materials.SpiderMaterial}
            castShadow
          />
        </group>
      )}
    </BaseMonster>
  );
}
