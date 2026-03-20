// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;          // Holds the intervals for timer ticks

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function updateTimer() {
  let timeLeft = parseInt(document.getElementById('timer').textContent);
  timeLeft -= 1;
  document.getElementById('timer').textContent = timeLeft;

  if (timeLeft == 0) {
    endGame();
  }
}

function collectWaterCan(event) {
  if (!gameActive) return; // Ignore clicks if the game is not active
  const target = event.target;

  // Check if the clicked element is a water can
  if (target.classList.contains('water-can')) {
    currentCans++; // Increment the count of collected items
    target.parentElement.remove(); // Remove the water can from the grid
    document.getElementById('current-cans').textContent = currentCans; // Update the displayed count
  }

}

// Initializes and starts a new game
function startGame() {
  document.getElementById('start-game').disabled = true; // Disable the start button when the game starts
  if (gameActive) return; // Failsafe: prevent starting a new game if one is already active
  gameActive = true;
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
  timerInterval = setInterval(updateTimer, 1000); // Decrement the timer every second
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop decrementing the timer
  document.querySelectorAll('.grid-cell').forEach(cell => (cell.innerHTML = '')); // Clear all cells
  document.getElementById('start-game').disabled = false; // Re-enable the start button
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.querySelector('.game-grid').addEventListener('click', collectWaterCan);