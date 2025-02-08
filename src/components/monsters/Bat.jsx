import { useEffect } from "react";
import { BaseMonster } from "./BaseMonster";
import { MONSTERS } from "../../config/monsters";

export function Bat({ position, id }) {
  const batConfig = MONSTERS.find((m) => m.type === "bat");

  return (
    <BaseMonster
      id={id}
      modelPath={batConfig.model}
      initialHealth={batConfig.baseHealth}
      monsterConfig={batConfig}
    >
      {({ nodes, materials, headRef, health }) => (
        <>
          <skinnedMesh
            name="BatMesh"
            geometry={nodes.BatMesh.geometry}
            skeleton={nodes.BatMesh.skeleton}
            position={position}
            castShadow
          />
        </>
      )}
    </BaseMonster>
  );
}
