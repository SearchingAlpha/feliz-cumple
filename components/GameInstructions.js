'use client';

/**
 * Game instructions component
 * Displays instructions for the game and a start button
 * 
 * @param {Object} props
 * @param {string} props.title - Game title
 * @param {string[]} props.instructions - Array of instruction texts
 * @param {string} props.goal - Win condition text
 * @param {Function} props.onStart - Function to call when start button is clicked
 */
export default function GameInstructions({ 
  title, 
  instructions = [], 
  goal = "Complete the game to win!",
  onStart 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-purple-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-purple-600 mb-2 font-pixel">{title}</h1>
        </div>
        
        <div className="text-center bg-white p-6 rounded-lg shadow-lg border-4 border-pink-300">
          <div className="mb-6">
            {instructions.map((instruction, index) => (
              <p key={index} className="text-purple-500 mb-2 font-pixel text-sm">
                {instruction}
              </p>
            ))}
            
            <div className="mt-4 p-3 bg-pink-50 rounded-lg">
              <p className="text-pink-600 font-pixel text-sm">
                <span className="text-pink-700">✨ Goal: </span>
                {goal}
              </p>
            </div>
          </div>
          
          {/* Decorative pixel elements */}
          <div className="flex justify-between mb-6">
            <div className="w-6 h-6 bg-pink-300"></div>
            <div className="w-6 h-6 bg-purple-300"></div>
            <div className="w-6 h-6 bg-pink-300"></div>
          </div>
          
          <button
            onClick={onStart}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl
                      border-b-4 border-r-4 border-opacity-50 border-black
                      hover:translate-y-1 hover:border-b-2 active:translate-y-2 active:border-b-0
                      font-pixel text-sm transition-all duration-200"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}