import { Sphere, useTexture } from "@react-three/drei";

function Moon() {
  const colorTexture = useTexture("./textures/moon.jpg");

  return (
    <Sphere position={[5, 18, -10]}>
      <meshStandardMaterial map={colorTexture} />
    </Sphere>
  );
}

export default Moon;
