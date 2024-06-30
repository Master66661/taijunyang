// Menu Constants
const MENU = 0;
const MAIN_GAME = 1;
const INS_MENU = 2;
const EXIT_MENU = 3;
let currentScreen = MENU;
let menuX = 0;
let menuY = 0;
let insX = 0;
let insY = 0;

// Button 
let startButton;
let insButton;
let exitButton;
let backButton;
let backToMenuButton; // Variable for the back button
let gameOverSoundPlayed = false;


// Game Variables
let playerTank;
let bullets = [];
let enemies = [];
let walls = [];
let steels = [];
let img2;
let steel1;
let wall;
let tankimg;
let bulletimg;
let kingimg;
let king;
let enemyimg;
let exitimg;
let gameOver = false; // Game Over flag
let gameWon = false;  // Game Won flag
let enemiesKilled = 0; // Keep track of defeated enemies
let maxEnemies = 15; // Maximum number of enemies to spawn


function preload() {
    // Image
    steel1 = loadImage('img/steel.png');
    wall = loadImage('img/brick.jpg');
    tankimg = loadImage('img/tank.png');
    bulletimg = loadImage('img/bullet.png');
    kingimg = loadImage('img/king.png');
    deadimg = loadImage('img/king_dead.png');
    enemyimg = loadImage('img/enemy.png');
    bgimg = loadImage('img/bg.gif');
    bg2img = loadImage('img/bg2.png');
    exitimg = loadImage('img/exit1.jpg');

    // Sound
    tankShoot = loadSound('sound/attack.mp3');
    tankDead = loadSound('sound/bomb1.mp3');
    gameStart = loadSound('sound/stageStart.mp3');
    gameOverSound = loadSound('sound/gameover.mp3');
}

function setup() {
    createCanvas(1280, 720);
    createButtons(); 
    playerTank = new Tank(width / 2 - 150, height - 80);

    for (let enemy of enemies) {
        setInterval(() => {
            enemy.shoot();
        }, 3500); // Enemy shoots every 3.5 seconds
    }
    
    let wallGrid = getWallGrid();

    let wallSize = 25;
    let steelSize = 25;
    for (let row = 0; row < wallGrid.length; row++) {
        for (let col = 0; col < wallGrid[row].length; col++) {
            if (wallGrid[row][col] === 1) {
                walls.push(new Wall(col * wallSize, row * wallSize));
            } else if (wallGrid[row][col] === 2) {
                steels.push(new Steel(col * steelSize, row * steelSize));
            } else if (wallGrid[row][col] === 8) {
                king = new King(col * wallSize, row * wallSize);
            } else if (wallGrid[row][col] === 5) {
                enemies.push(new Enemy(col * wallSize, row * wallSize));
                
            }
        }
    }
}


function draw() {
    background(0);

    if (currentScreen === MENU) {
        showMenuScreen();
    } else if (currentScreen === MAIN_GAME) {
        showGameScreen();
    } else if (currentScreen === INS_MENU) {
        showInstructionsScreen();
    } else if (currentScreen === EXIT_MENU) {
        showExitScreen();
    }
}

function showMenuScreen() {
    image(bgimg, menuX, menuY, 1280, 720);

    startButton.show();
    insButton.show();
    exitButton.show();
    backButton.hide();
    backToMenuButton.hide(); 
}

function showGameScreen() {
    background(0);

    if (gameOver) {
        if (!gameOverSoundPlayed) {
            gameOverSound.play();
            gameOverSoundPlayed = true; 
        }
        textSize(50);
        fill(255);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2);

        textSize(20);
        text("Press 'R' to Restart", width / 2, height / 2 + 60);
        backToMenuButton.show(); 
        return;
    }

    if (gameWon) {
        textSize(50);
        fill(255);
        textAlign(CENTER, CENTER);
        text("You Win!", width / 2, height / 2);

        textSize(20);
        text("Press 'R' to Restart", width / 2, height / 2 + 60);
        backToMenuButton.show();    
        return;
    }

    playerTank.update();
    playerTank.render();
    playerTank.displayLives();


    // Handle bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();

        // Check collision with walls
        let bulletHitWall = false;
        for (let j = walls.length - 1; j >= 0; j--) {
            if (bullets[i] && bullets[i].hitsWall(walls[j])) {
                bullets.splice(i, 1);
                walls.splice(j, 1);
                bulletHitWall = true;
                break;
            }
        }

        // If bullet hit a wall, it was removed, so continue to next bullet
        if (bulletHitWall) {
            continue;
        }

        // Check collision with steels
        let bulletHitSteel = false;
        for (let k = steels.length - 1; k >= 0; k--) {
            if (bullets[i] && bullets[i].hitsSteel(steels[k])) {
                bullets.splice(i, 1);
                bulletHitSteel = true;
                break;
            }
        }

        // If bullet hit steel, it was removed, so continue to next bullet
        if (bulletHitSteel) {
            continue;
        }

        // Check collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (bullets[i] && bullets[i].hitsEnemy(enemies[j])) {
                bullets.splice(i, 1);
                enemies[j].destroy(); // Call the destroy() function when an enemy is hit
                enemies.splice(j, 1);
                break;
            }
        }

        // Check collision with king
        if (king && bullets[i] && bullets[i].hitsKing(king)) {
            bullets.splice(i, 1);
            king.hit();
            gameOver = true;
            continue;
        }

        // Check bullet collisions with player tank (only for enemy bullets)
        if (bullets[i] && bullets[i].fromEnemy && bullets[i].hitsTank(playerTank)) {
            bullets.splice(i, 1);
            playerTank.hit();  // Call the hit() function to handle the tank being hit
        }
        

        if (bullets[i]) {
            bullets[i].render();
            if (bullets[i].offscreen()) {
                bullets.splice(i, 1);
            }
        }
    }

    // Handle enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].render();
    }
    // Respawn Enemy Logic (after bullet handling)
    if (enemiesKilled < maxEnemies && enemies.length === 0) {
        respawnEnemy();
    }
    

    // Handle walls
    for (let i = walls.length - 1; i >= 0; i--) {
        walls[i].render();
    }

    // Handle steels
    for (let i = steels.length - 1; i >= 0; i--) {
        steels[i].render();
    }

    // Handle king
    if (king) {
        king.render();
    }

    // Check win condition
    if (enemiesKilled >= maxEnemies && enemies.length === 0) {
        gameWon = true;
    }

    // Hide menu buttons when entering the game
    startButton.hide();
    insButton.hide();
    exitButton.hide();
}

function showInstructionsScreen() {

    background(0);
    push();
    image(bg2img, insX + 500, insY + 300, 720, 400);
    noStroke();
    fill(255);
    textSize(40);
    textAlign(LEFT, TOP); // Align text to the top-left
  
    text("Welcome to Tank Battle!", 50, 50); // Add title
  
    textSize(28); // Slightly smaller text for instructions
    text("1. Protect the King (Eagle):", 50, 110);
    text("   - Your top priority is to defend the King from enemy attacks.", 50, 140);
    text("   - If the King is destroyed, you lose the game.", 50, 170);
  
    text("2. Destroy Enemy Tanks:", 50, 220);
    text("   - Eliminate all enemy tanks to win the game.", 50, 250);
  
    text("3. Controls:", 50, 300);
    text("   - Arrow Keys: Move your tank", 50, 330);
    text("   - Spacebar: Shoot", 50, 360);
    pop();
    // Show the back button
    backButton.show();
    
}

function showExitScreen() {
    image(exitimg,menuX,menuY,1280,720);
}

function createButtons() {
    // Create the buttons and set their initial state
    startButton = createButton('Start Game');
    startButton.position(555, 635);
    styleButtons(startButton); // Style the button using a function (explained below)
    startButton.mousePressed(() => {
        gameStart.play(); // Play game start sound
        currentScreen = MAIN_GAME;
        hideMenuButtons(); // Hide buttons when starting
    });

    insButton = createButton('Instructions');
    insButton.position(300, 635);
    styleButtons(insButton);
    insButton.mousePressed(() => {
        currentScreen = INS_MENU;
        hideMenuButtons();
    });

    exitButton = createButton('Exit');
    exitButton.position(850, 635);
    styleButtons(exitButton);
    exitButton.mousePressed(() => {
        currentScreen = EXIT_MENU;
        hideMenuButtons();
    });

    backButton = createButton('Back');
    backButton.position(540, 640);
    styleButtons(backButton);
    backButton.mousePressed(() => {
        currentScreen = MENU;
        showMenuButtons(); // Show buttons when going back
    });
    backButton.hide(); // Initially hide the back button

    backToMenuButton = createButton('Back to Menu');
    backToMenuButton.position(10, 10); // Position at top-left corner (adjust as needed)
    styleButtons(backToMenuButton);
    backToMenuButton.mousePressed(() => {
        currentScreen = MENU;
        showMenuButtons(); 
        restartGame(); // Optional: Restart the game when going back to the menu

    });
    backToMenuButton.hide(); // Initially hide the back button
}

function hideMenuButtons() {
    startButton.hide();
    insButton.hide();
    exitButton.hide();
    backToMenuButton.hide(); // Hide the back button as well

}

function showMenuButtons() {
    startButton.show();
    insButton.show();
    exitButton.show();
}

// Function to style buttons (centralized for easier changes)
function styleButtons(button) {
    // Base Styles (Common to all button styles)
    button.style('font-size', '25px');
    button.style('padding', '18px 25px');
    button.style('color', 'white'); // Consistent text color
    button.style('border', 'none');
    button.style('border-radius', '10px'); // Rounded corners
    button.style('transition', 'all 0.3s ease'); // Smooth transitions for all properties
    button.style('cursor', 'pointer');
  
    button.style('background', 'linear-gradient(45deg, #003366, #4AFFE2)'); 

  
    // Hover Effects (Specific to each button style)
    button.mouseOver(() => {
      if (button.style('background').includes('linear-gradient(45deg,')) { // Instagram
        button.style('box-shadow', '0 0 20px #405de6'); // Brighter
      } 
    });
  
    button.mouseOut(() => {
      // Reset to original styles on mouse out
      button.style('box-shadow', 'none');
      button.style('filter', 'none');
      button.style('transform', 'none');
      button.style('background', button.originalBackground); // Use stored original background
    });
  }
  

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        playerTank.setDir(-1, 0);
        playerTank.setRotation(-PI / 2);
    } else if (keyCode === RIGHT_ARROW) {
        playerTank.setDir(1, 0);
        playerTank.setRotation(PI / 2);
    } else if (keyCode === UP_ARROW) {
        playerTank.setDir(0, -1);
        playerTank.setRotation(0);
    } else if (keyCode === DOWN_ARROW) {
        playerTank.setDir(0, 1);
        playerTank.setRotation(PI);
    } else if (key === ' ') {
        playerTank.shoot();
    } else if (key === 'R' || key === 'r') {
        restartGame();
        backToMenuButton.hide(); 
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        playerTank.setDir(0, 0);
    }
}

class Tank {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1.5;
        this.dirX = 0;
        this.dirY = 0;
        this.size = 42;
        this.rotation = 0; // New property to store the rotation angle
        this.lives = 3; // Add a 'lives' property to track remaining lives

    }

    update() {
        let nextX = this.x + this.dirX * this.speed;
        let nextY = this.y + this.dirY * this.speed;

        if (!this.collides(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }

        this.x = constrain(this.x, 0, width - this.size);
        this.y = constrain(this.y, 0, height - this.size);
    }

    render() {
        push();
        translate(this.x + this.size / 2 , this.y + this.size /2 );
        rotate(this.rotation);
        imageMode(CENTER);
        image(tankimg, 0, 0, this.size, this.size);
        pop();
        
    }

    setDir(x, y) {
        this.dirX = x;
        this.dirY = y;
    }

    setRotation(angle) {
        this.rotation = angle;
    }

    shoot() {
        let bullet = new Bullet(this.x + this.size / 2, this.y + this.size / 2, this.rotation);
        bullets.push(bullet);
        tankShoot.play(); // Play tank shooting sound here
    }

    collides(nextX, nextY) {
        // Check collision with walls
        for (let i = 0; i < walls.length; i++) {
            let wall = walls[i];
            if (nextX + this.size  > wall.x - 14 && 
                nextX  < wall.x + wall.size - 14 &&
                nextY + this.size  > wall.y - 14 && 
                nextY  < wall.y + wall.size - 14 ) {
                return true;
            }
        }

        // Check collision with steels
        for (let i = 0; i < steels.length; i++) {
            let steel = steels[i];
            if (nextX + this.size > steel.x  - 14 && 
                nextX < steel.x + steel.size - 12 &&
                nextY + this.size > steel.y - 14  && 
                nextY < steel.y + steel.size - 12) {
                return true;
            }
        }

          // Check collision with enemies
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            if (
            nextX + this.size > enemy.x && // Adjusted for enemy size
            nextX < enemy.x + enemy.size &&
            nextY + this.size > enemy.y  && 
            nextY < enemy.y + enemy.size 
            ) {
            return true;
            }
        }
        return false;
    }

    hit() { 
        this.lives--;  // Decrease a life when hit by an enemy bullet
        if (this.lives <= 0) {
          gameOver = true;  
        }
      }

    displayLives() {
        push();
        noStroke();
        textSize(16);
        fill(255);
        text("Lives: " + this.lives, this.x - 5, this.y + this.size +15);
        pop();
    }
}

class Bullet {
    constructor(x, y, rotation, fromEnemy) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.size = 8;
        this.rotation = rotation;
        this.fromEnemy = fromEnemy;
    }

    update() {
        this.x += this.speed * sin(this.rotation);
        this.y += this.speed * -cos(this.rotation);
    }

    render() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        imageMode(CENTER);
        image(bulletimg, 0, 0, this.size, this.size);
        pop();
    }

    offscreen() {
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
    }

    hitsWall(wall) {
        return (this.x > wall.x - wall.size / 2 &&
                this.x < wall.x + wall.size / 2 &&
                this.y > wall.y - wall.size / 2 &&
                this.y < wall.y + wall.size / 2);
    }

    hitsSteel(steel) {
        return (this.x > steel.x - steel.size / 2 &&
                this.x < steel.x + steel.size / 2 &&
                this.y > steel.y - steel.size / 2 &&
                this.y < steel.y + steel.size / 2);
    }

    hitsKing(king) {
        return (this.x > king.x - king.size / 2 &&
                this.x < king.x + king.size  &&
                this.y > king.y - king.size  &&
                this.y < king.y + king.size / 2);
    }

    hitsTank(tank) {
        return (this.x > tank.x &&
                this.x < tank.x + tank.size &&
                this.y > tank.y &&
                this.y < tank.y + tank.size);
    }

    hitsEnemy(enemy) {
        if (this.fromEnemy) {
            return false; 
          }
      
          return (
            this.x > enemy.x - enemy.size / 2 &&
            this.x < enemy.x + enemy.size &&
            this.y > enemy.y - enemy.size &&
            this.y < enemy.y + enemy.size / 2
          );
    }
}


class Wall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 26.5; // Size of the wall block
    }

    render() {
        imageMode(CENTER);
        image(wall, this.x, this.y, this.size, this.size);
    }
}

class Steel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 26; // Size of the steel block
    }

    render() {
        imageMode(CENTER);
        image(steel1, this.x, this.y, this.size, this.size);
    }
}

class King {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40; // Size of the king
        this.isAlive = true; // Property to check if the king is alive
    }

    render() {
        // imageMode(CENTER);
        if (this.isAlive) {
            image(kingimg, this.x + 12, this.y - 10, this.size, this.size);
        } else {
            image(deadimg, this.x + 12 , this.y - 10, this.size, this.size);
        }
    }

    hit() {
        this.isAlive = false; // Change the state of the king to dead
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.dirX = 0;
        this.dirY = 0;
        this.size = 42;
        this.rotation = 0;
        this.bulletRotation = PI;
        this.shooting = false;
        this.shootingInterval = setInterval(() => this.shoot(), 2000); // Shooting interval for enemy
    }

    update() {
        let nextX = this.x + this.dirX * this.speed;
        let nextY = this.y + this.dirY * this.speed;

        if (!this.collides(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }

        this.x = constrain(this.x, 0, width - this.size);
        this.y = constrain(this.y, 0, height - this.size);

        // Random Movement Logic
        if (frameCount % 180 === 0) { // Change direction every second (adjust the value if needed)
            let validMoves = [];

            // Check for valid moves (up, down, left, right)
            // if (!this.collides(this.x, this.y - this.speed)) validMoves.push([0, -1]); // Up
            if (!this.collides(this.x, this.y + this.speed)) validMoves.push([0, 1]);  // Down
            if (!this.collides(this.x - this.speed, this.y)) validMoves.push([-1, 0]); // Left
            if (!this.collides(this.x + this.speed, this.y)) validMoves.push([1, 0]);  // Right

            if (validMoves.length > 0) {
                let randomIndex = floor(random(validMoves.length));
                this.setDir(...validMoves[randomIndex]);

                // Determine the rotation angle based on direction
                if (this.dirX === -1) this.rotation = PI / 2;
                else if (this.dirX === 1) this.rotation = -PI / 2;
                // else if (this.dirY === -1) this.rotation = PI;
                else if (this.dirY === 1) this.rotation = 0;

                // Set the bullet rotation to be opposite the enemy's rotation
                this.bulletRotation = this.rotation + PI; // Reverse the rotation
            }
        } 
    }

    render() {
        push();
        translate(this.x + this.size / 2 , this.y + this.size /2 );
        rotate(this.rotation);
        imageMode(CENTER);
        image(enemyimg, 0, 0, this.size, this.size);
        pop();
    }

    setDir(x, y) {
        this.dirX = x;
        this.dirY = y;
    }

    shoot() {
        if (!this.isDestroyed) { // Check if the enemy is still alive
            let bullet = new Bullet(this.x + this.size / 2, this.y + this.size / 2, this.bulletRotation, true);
            bullets.push(bullet);
        }
    }
 
    collides(nextX, nextY) {
        for (let i = 0; i < walls.length; i++) {
            let wall = walls[i];
            if (nextX + this.size  > wall.x - 12 && 
                nextX  < wall.x + wall.size - 10 &&
                nextY + this.size  > wall.y - 10 && 
                nextY  < wall.y + wall.size - 10 ) {
                return true;
            }
        }

        for (let i = 0; i < steels.length; i++) {
            let steel = steels[i];
            if (nextX + this.size > steel.x  - 10 && 
                nextX < steel.x + steel.size - 10 &&
                nextY + this.size > steel.y - 10  && 
                nextY < steel.y + steel.size - 10) {
                return true;
            }
        }

        // Check collision with other enemies
        for (let i = 0; i < enemies.length; i++) {
            let otherEnemy = enemies[i];
            if (otherEnemy !== this && // Make sure we're not checking against ourselves
                nextX + this.size > otherEnemy.x &&
                nextX < otherEnemy.x + otherEnemy.size &&
                nextY + this.size > otherEnemy.y &&
                nextY < otherEnemy.y + otherEnemy.size) {
            return true;
            }
        }
    
        // Check collision with tank 
        if (
            nextX < playerTank.x + playerTank.size &&
            nextX + this.size > playerTank.x &&
            nextY < playerTank.y + playerTank.size &&
            nextY + this.size > playerTank.y
        ) {
            return true;
        }
        return false;
    }

    destroy() {
        clearInterval(this.shootingInterval); 
        this.isDestroyed = true;
        enemiesKilled++; // Increment the kill count
        tankDead.play(); // Play tank death sound when enemy is destroyed
        if (enemiesKilled < maxEnemies) { // Check if we haven't reached the maximum
          setTimeout(respawnEnemy, 1000); // Respawn after 1 second delay
        }
      }
}

function respawnEnemy() {
    let openSpots = [];
  
    // Find empty spots (marked as '5' in the grid)
    for (let row = 0; row < getWallGrid().length; row++) {
      for (let col = 0; col < getWallGrid()[row].length; col++) {
        if (getWallGrid()[row][col] === 5) {
          openSpots.push({ row, col });
        }
      }
    }
  
    // If there are open spots, choose one randomly
    if (openSpots.length > 0) {
      let randomIndex = floor(random(openSpots.length));
      let spawnSpot = openSpots[randomIndex];
      enemies.push(new Enemy(spawnSpot.col * 25, spawnSpot.row * 25));
    }
  }

function restartGame() {
    // Clear and repopulate enemies
    for (let enemy of enemies) {
        clearInterval(enemy.shootingInterval); // Clear shooting intervals of existing enemies
    }

    gameOver = false;
    gameWon = false;
    gameOverSoundPlayed = false; // Reset the flag
    king.isAlive = true;
    enemiesKilled = 0;

    // Reset player tank
    playerTank = new Tank(width / 2 - 150, height - 80);

    // Clear bullets, enemies, walls, and steels arrays
    bullets = [];
    enemies = [];
    walls = [];
    steels = [];

    wallGrid = getWallGrid();

    menuX = width / 2;
    menuY = height / 2; // Reset menu position when going back to the menu
    insX = 400;
    insY = 200;

    // Initialize walls based on the grid (reuse the setup code)
    wallSize = 25;
    steelSize = 25;
    for (let row = 0; row < wallGrid.length; row++) {
        for (let col = 0; col < wallGrid[row].length; col++) {
            if (wallGrid[row][col] === 1) {
                walls.push(new Wall(col * wallSize, row * wallSize));
            } else if (wallGrid[row][col] === 2) {
                steels.push(new Steel(col * steelSize, row * steelSize));
            } else if (wallGrid[row][col] === 8) {
                king = new King(col * wallSize, row * wallSize);
            } else if (wallGrid[row][col] === 5) {
                enemies.push(new Enemy(col * wallSize, row * wallSize));
            }
        }
    }
}


function getWallGrid() {
    // Returns the initial wall grid configuration
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,2],
        [0,2,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,2,0,0,0,2,0,0,1,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,1,1,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,2,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,2],
        [0,2,0,5,0,0,0,1,1,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0,2,1,0,0,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,1,1,0,0,0,1,2,2,1,0,0,1,0,1,0,1,0,0,2,1,0,0,0,0,0,0,1,1,1,2,2,2,1,1,1,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,1,1,0,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0,1,0,2,0,0,0,0,0,1,1,1,2,1,2,1,1,1,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,2,2,0,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,2,0,0,0,0,1,0,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,0,1,1,1,0,1,1,1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,2],
        [0,2,1,1,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,2],
        [0,2,1,1,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0,1,1,2],
        [0,2,2,2,0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,0,2,2,2],
        [0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,2,2,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,2],
        [0,2,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,2],
        [0,2,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,2],
        [0,2,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,5,0,0,2],
        [0,2,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,0,2],
        [0,2,0,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,9,9,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,8,9,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        
    ];
}



