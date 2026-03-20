// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;          // Holds the intervals for timer ticks

// Game outcome messages
const WIN_MESSAGES = [
  "Congratulations! You've collected enough water cans and won the game!",
  "Well done! You've successfully completed the Water Quest!",
  "You did it! The water can goal is reached, you win!"
];

const LOSE_MESSAGES = [
  "Time's up! You fell short of the goal. Try again!",
  "Game over! You didn't collect enough water cans. Another round?",
  "Oh no! You ran out of time before collecting enough water cans. Let's give it another shot!"
];

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

  // Show game over message based on the player's results
  if (currentCans >= GOAL_CANS) {
    const message = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
    showMessageBox(message);
  } else {
    const message = LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)];
    showMessageBox(message);
  }

  document.getElementById('start-game').disabled = false; // Re-enable the start button
}

// Displays a message to the user in a special message box
// AI-generated, used for game over message
function showMessageBox(message) {
  let box = document.getElementById('game-messagebox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'game-messagebox';
    box.className = 'messagebox';
    box.innerHTML = `
      <div class="messagebox-content">
        <span id="messagebox-text"></span>
        <button id="messagebox-close">OK</button>
      </div>
    `;
    document.body.appendChild(box);
    document.getElementById('messagebox-close').addEventListener('click', () => {
      box.style.display = 'none';
    });
  }
  document.getElementById('messagebox-text').textContent = message;
  box.style.display = 'flex';
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
document.querySelector('.game-grid').addEventListener('click', collectWaterCan);