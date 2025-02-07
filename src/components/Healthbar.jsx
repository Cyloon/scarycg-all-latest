function Healthbar({ health, position }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[1, 0.1]} />
      <meshBasicMaterial color="red" />

      <mesh position={[-0.5 * (1 - health / 100), 0, 0]}>
        <planeGeometry args={[health / 100, 0.1]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </mesh>
  );
}

export default Healthbar;
