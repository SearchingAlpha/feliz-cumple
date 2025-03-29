// Create a new file: lib/gameState.js

/**
 * Utility functions for managing game state
 */

/**
 * Get the current game state from localStorage or return defaults
 */
export function getGameState() {
  const defaultState = {
    flowerMatch: false,
    cupcakeCatch: false,
    heartJump: false
  };
  
  try {
    const savedState = localStorage.getItem('gameState');
    
    if (!savedState) {
      return defaultState;
    }
    
    const parsedState = JSON.parse(savedState);
    if (typeof parsedState !== 'object') {
      return defaultState;
    }
    
    // Ensure all required properties exist
    return {
      ...defaultState,
      ...parsedState
    };
  } catch (error) {
    console.error("Error getting game state:", error);
    return defaultState;
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(newState) {
  try {
    // Get current state and merge with new state
    const currentState = getGameState();
    const updatedState = { ...currentState, ...newState };
    
    // Save to localStorage
    localStorage.setItem('gameState', JSON.stringify(updatedState));
    
    // Also save to sessionStorage as a backup
    sessionStorage.setItem('updatedGameState', JSON.stringify(updatedState));
    
    // Set flag to notify other components
    localStorage.setItem('forceRefresh', Date.now().toString());
    
    console.log("Game state saved:", updatedState);
    
    return true;
  } catch (error) {
    console.error("Error saving game state:", error);
    return false;
  }
}

/**
 * Mark a specific game as completed
 */
export function markGameAsCompleted(gameId) {
  try {
    const state = getGameState();
    state[gameId] = true;
    console.log(`Marking game ${gameId} as completed. Updated state:`, state);
    
    // Also store in sessionStorage as backup
    sessionStorage.setItem('updatedGameState', JSON.stringify(state));
    
    return saveGameState(state);
  } catch (error) {
    console.error("Error marking game as completed:", error);
    return false;
  }
}

/**
 * Reset a specific game's completion status
 */
export function resetGame(gameId) {
  try {
    const state = getGameState();
    state[gameId] = false;
    return saveGameState(state);
  } catch (error) {
    console.error("Error resetting game:", error);
    return false;
  }
}

/**
 * Reset all games
 */
export function resetAllGames() {
  try {
    return saveGameState({
      flowerMatch: false,
      cupcakeCatch: false,
      heartJump: false
    });
  } catch (error) {
    console.error("Error resetting all games:", error);
    return false;
  }
}