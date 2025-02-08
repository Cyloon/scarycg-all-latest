import { useEffect } from "react";
import { BaseMonster } from "./BaseMonster";
import { MONSTERS } from "../../config/monsters";

export function Zombie({ position, id }) {
  const zombieConfig = MONSTERS.find((m) => m.type === "zombie");

  return (
    <BaseMonster
      id={id}
      modelPath={zombieConfig.model}
      initialHealth={zombieConfig.baseHealth}
      monsterConfig={zombieConfig}
    >
      {({ nodes, materials, headRef, health }) => (
        <>
          <skinnedMesh
            name="EnemyMesh"
            geometry={nodes.EnemyMesh.geometry}
            skeleton={nodes.EnemyMesh.skeleton}
            position={position}
            castShadow
          />
        </>
      )}
    </BaseMonster>
  );
}
