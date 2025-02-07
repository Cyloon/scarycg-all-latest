import { Helper } from "@react-three/drei";
import { DirectionalLightHelper } from "three";

function Moonlight() {
  return (
    <directionalLight
      castShadow={true}
      color={"#ffffff"}
      position={[10, 7, -10]} //[5, 18, -10] [10, 7, -10]
      shadow-mapSize={2048}
      shadow-bias={-0.001}
      intensity={0.7}
      target-position={[0, 0, 7]}
    >
      <orthographicCamera
        attach="shadow-camera"
        args={[-50, 50, 50, -50, 0.1, 100]}
      />
      {/* <Helper type={DirectionalLightHelper} /> */}
    </directionalLight>
  );
}

export default Moonlight;

/* shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-bias={-0.002}
        shadow-camera-top={300}
        shadow-camera-bottom={-300}
        shadow-camera-left={-300}
        shadow-camera-right={300} */
