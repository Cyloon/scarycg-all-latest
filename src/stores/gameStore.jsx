import create from "zustand";

const SPOTLIGHT_CONFIG = {
  MIN_ANGLE: Math.PI / 160,
  MAX_ANGLE: Math.PI / 12,
  DEFAULT_ANGLE: 0.05,
  DAMAGE_CHECK_INTERVAL: 100,
  RANDOM_POINTS: 5,
  SPOTLIGHT_POSITION: [0, 0.9, 24],
};

const PLANE_CONFIG = {
  PLANE_POSITION: [0, 0, -5],
};

const INITIAL_FLASHLIGHT = {
  angle: SPOTLIGHT_CONFIG.DEFAULT_ANGLE,
  bottomRadius: 1,
  intensity: 3,
  //battery: 100,
};

const DIFICULTY_SETTINGS = {
  easy: {
    zombieSpeed: 0.5,
    zombieHealth: 50,
    damageMultiplier: 0.7,

    //batteryDrain: 0.5
  },
  medium: {
    zombieSpeed: 1,
    zombieHealth: 100,
    damageMultiplier: 1,
    //batteryDrain: 1
  },
  hard: {
    zombieSpeed: 1.5,
    zombieHealth: 150,
    damageMultiplier: 1.3,
    //batteryDrain: 1.5
  },
};

export const useGameStore = create((set, get) => ({
  score: 0,
  health: 100,
  //ammo: 100,
  isGameOver: false,
  isPaused: false,
  difficulty: "easy",
  flashlightState: INITIAL_FLASHLIGHT,
  activeEnemies: [],
  highScores: [],
  getSpotlightConfig: () => SPOTLIGHT_CONFIG,
  getPlaneConfig: () => PLANE_CONFIG,
  //getDifficultySettings: () => DIFICULTY_SETTINGS[get().difficulty],

  addScore: (points) => {
    set((state) => ({ score: state.score + points }));
  },

  updateHealth: (amount) => {
    set((state) => {
      const currentHealth = Math.max(0, Math.min(100, state.health + amount));
      const isGameOver = currentHealth <= 0;

      if (isGameOver) {
        const newHighScores = [...state.highScores, state.score]
          .sort((a, b) => b - a)
          .slice(0, 10);

        return {
          health: currentHealth,
          isGameOver,
          highScores: newHighScores,
        };
      }
      return { health: currentHealth };
    });
  },

  updateFlashlight: (updates) => {
    set((state) => {
      const newState = { ...state.flashlightState, ...updates };

      if (newState.angle) {
        newState.angle = Math.max(
          SPOTLIGHT_CONFIG.MIN_ANGLE,
          Math.min(SPOTLIGHT_CONFIG.MAX_ANGLE, newState.angle)
        );
      }

      return { flashlightState: newState };
    });
  },

  /*   updateFlashlight: (updates) => {
    set((state) => ({
      flashlightState: {
        ...state.flashlightState,
        ...updates,
      },
    }));
  }, */

  togglePause: () => {
    set((state) => ({
      isPaused: !state.isPaused,
    }));
  },

  resetGame: () => {
    set({
      score: 0,
      health: 100,
      isGameOver: false,
      isPaused: false,
      flashlightState: INITIAL_FLASHLIGHT,
      activeEnemies: [],
    });
  },

  setDifficulty: (difficulty) => {
    set({ difficulty });
  },

  getDifficultySettings: () => {
    return DIFICULTY_SETTINGS[get().difficulty];
  },

  addEnemy: (enemy) => {
    set((state) => ({ activeEnemies: [...state.activeEnemies, enemy] }));
  },

  removeEnemy: (enemyId) => {
    set((state) => ({
      activeEnemies: state.activeEnemies.filter(
        (enemy) => enemy.id !== enemyId
      ),
    }));
  },

  isPlayerAlive: () => {
    return get().health > 0;
  },

  /* getCurrentBattery: () => {
    return get().flashlightState.battery;
  },

  drainBattery: (amount) => {
    const settings = DIFFICULTY_SETTINGS[get().difficulty];
    const drainAmount = amount * settings.batteryDrain;

    set((state) => ({
      flashlightState: {
        ...state.flashlightState,
        battery: Math.max(0, state.flashlightState.battery - drainAmount),
      },
    }));
  }, */
}));

if (typeof window !== "undefined") {
  const savedHighScores = localStorage.getItem("highScores");
  if (savedHighScores) {
    useGameStore.setState({ highScores: JSON.parse(savedHighScores) });
  }

  useGameStore.subscribe((state) => {
    state.highScores,
      (highScores) => {
        localStorage.setItem("highScores", JSON.stringify(highScores));
      };
  });
}
