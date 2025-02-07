import { useGameStore } from "../stores/gameStore";

export const GameUI = () => {
  const { score, health, flashlightState, isPaused, difficulty, highScores } =
    useGameStore();

  return (
    <div className="game-ui">
      <div className="stats">
        <div>Score: {score}</div>
        <div>Health: {health}</div>
        {/* </div><div>Flashlight: {flashlightState.battery}%</div> */}
        <div>Difficulty: {difficulty}</div>
      </div>

      {isPaused && (
        <div className="paused">
          <h2>Paused</h2>
          <div className="high-scores">
            <h3>High Scores</h3>
            {highScores.map((score, index) => (
              <div key={index}>
                {index + 1}. {score}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
