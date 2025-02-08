const GameStore = {
  score: 0,
  addScore: (points) => {
    GameStore.score += points;
    console.log(`Score: ${GameStore.score}`);
  },
};

function Enemy() {
  const [health, setHealth] = React.useState(100);
  const meshRef = React.useRef();

  const handleDamage = React.useCallback((amount) => {
    setHealth((prev) => {
      const newHealth = Math.max(0, prev - amount);
      if (newHealth === 0) {
        console.log("Enemy defeated!");
      }
      return newHealth;
    });
    GameStore.addScore(10);
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={[2, 0, 0]}
      userData={{
        type: "enemy",
        id: "zombie1",
        handleDamage,
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={health > 50 ? "green" : "red"} />
    </mesh>
  );
}

function Flashlight() {
  const raycaster = new THREE.Raycaster();
  const rayDirection = new THREE.Vector3(1, 0, 0);

  const shoot = () => {
    raycaster.set(new THREE.Vector3(0, 0, 0), rayDirection);
    const intersects = raycaster.intersectObject(window.enemy, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      if (hit.object.userData.type === "enemy") {
        hit.object.userData.handleDamage(20);
        console.log("Hit enemy!");
      }
    }
  };

  return (
    <mesh position={[0, 0, 0]} onClick={shoot}>
      <boxGeometry args={[0.5, 0.5, 2]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Enemy />
        <Flashlight />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
