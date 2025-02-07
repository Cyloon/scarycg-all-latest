import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { Suspense } from "react";

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 2, 27], fov: 45 }}>
      {/* 55 when on mobile? lower camera target? */}
      <color attach="background" args={["#0d0d0d"]} /> {/* "#DC0083" */}
      {/* <fog attach="fog" color="#2d2d2d" near={0.5} far={70} /> */}
      {/* color="#303030" /}
      {/* <fog attach={"fog"} args={["#000000", 20, 45]} /> */}
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default App;
