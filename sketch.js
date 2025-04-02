//Tutorial for Cave Generation: https://www.youtube.com/watch?v=FSNUp_8Xvqo


//Objective: Procedural Cave generation rules with variable influneced by souund input  

//Note: When in fullscreen, make sure the microphone permissions are turned on. Mouse click to start the sound visualization. 

//VARIABLES

//volume
let mic;
let vol;

//grid
let grid;
let cellSize = 6;
let numRows, numCols;
let percentWalls = 0.45;
let maxGenerations = 10;


//array of colors for the grid
let colorArray = [];

//list of colors
let colors = [];

//Set generation in CA
let generation = 0;

//Amimated noise
let noiseTranslate = 0; 


function setup() {
  
//Change the dimensions to fit the 16 to 9 ratio at any screen 
  let aspectRatio = 16/9;
  let canvasHeight = windowHeight;
  let canvasWidth = canvasHeight * aspectRatio;
  // createCanvas(1920, 1080);
  
  //Display resolution
  pixelDensity(2);
  
  //Create the grid with randomized values
  numRows = floor(height / cellSize);
  grid = createRandomGrid(numCols, numRows, percentWalls);
  
  //FPS
  frameRate(12);
  
  //Start map input
  mic = new p5.AudioIn();
  
  
  mic.start();
  mic.amp(1);
  colors = colors = ["#52A4F7", "#52ADF7","#529BF7","#5292F7", "#5289F7", "#526EF7", "#6166F7", "#725EF7", "#8456F7", "#9550F7", "#A152F7"];

}

function draw() {
  background(0);
  
//Volume values multiplied by 10
  vol = mic.getLevel() * 10;
  
//Constrain values from 0 to 1
  vol = constrain(vol, 0, 1);
  
//Slow increase of noise()
  let noiseVal = noise(noiseTranslate);
  noiseTranslate += 0.01;
  
//Map noise() to cellSize()
  cellSize = map(noiseVal, 0, 1, 4, 20);
  
//Number of columns and rows based on cellSize()
  numCols = floor(width / cellSize);
  numRows = floor(height / cellSize);
  
   //cellSize = map(vol, 0, 1, 4, 20);

//Courtesy of ChatGPT
  //If size of grid has changed, recreate the grid
  if (numCols != grid.length || numRows != grid[0].length){
    grid = createRandomGrid(numCols, numRows, percentWalls);
  }
  
  //print the volume in the console log
  console.log(vol);
  
  //Draw the current 
  drawGrid();
  
  //Map volume to number of generations
  let genMotion = floor((map(vol, 0, 1, 0, 10)));
  
  //Update and add to generation count
  for (let i = 0; i < genMotion; i++) {
    updateGrid();
    generation++;
    
  //Reset to 0 when maxGeneration values is reached
    if (generation >= maxGenerations) {

      generation = 0; 
      grid = createRandomGrid(numCols, numRows, percentWalls);    
   }
  }

}

//Random walls based on percentWalls
function createRandomGrid(cols, rows, percentWalls) {
  noStroke();
  let grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      if (i === 0 || j === 0 || i === cols - 1 || j === rows - 1) {
        grid[i][j] = 1;
      } else {
        grid[i][j] = random(1) < percentWalls ? 1 : 0;
      }
    }
  }
  return grid;
}

function drawGrid() {
  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      let x = i * cellSize;
      let y = j * cellSize;
      
      
//ap volume to color index
      let colorMapped = floor((map(vol, 0, 1, 0, colors.length)));
      
      //Courtesy of ChatGPT

//Constrain color index
      colorMapped = constrain(colorMapped, 0, colors.length - 1);
      colorArray = colors[colorMapped];
      
      if (grid[i][j] === 1) {
        //Fill with color set here
        let myCol = color("#3D2878")
        fill(myCol);
      } else {
        //Fill with mapped color

        fill(colorArray);

      }
      rect(x, y, cellSize, cellSize);
    }
  }
}

function updateGrid() {
  let nextGrid = createEmptyGrid(numCols, numRows);
  
  //Rules
  for (let i = 1; i < numCols - 1; i++) {
    for (let j = 1; j < numRows - 1; j++) {
      
      //Check number around the cell
      let wallCount = countWalls(i, j);
      if (grid[i][j] === 1) {
        //Survives if neighbors with 4 or more walls
        if (wallCount >= 4) {
          nextGrid[i][j] = 1;
        } else {
          nextGrid[i][j] = 0;
        }
      } else {
        //
        if (wallCount == 5) {
          nextGrid[i][j] = 1;
        } else{ 
          if (wallCount == 6)
          nextGrid[i][j] = 0;
        }
      }
    }
  }
  grid = nextGrid;
}

 
 

//Count the number of neighboring cells with a values of 1 
function countWalls(x, y) {
  let wallCount = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (grid[x + i][y + j] === 1) {
        wallCount++;
      }
    }
  }
  return wallCount;
}

function createEmptyGrid(cols, rows) {
  let grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
  return grid;
}

//Adjust the canvas size based on the window size
function windowResized(){
  //Assisted by ChatGPT
  let aspectRatio = 16/9;
  let canvasHeight = windowHeight;
  let canvasWidth = canvasHeight * aspectRatio;
  
  resizeCanvas(canvasWidth, canvasHeight);
  numCols = floor(width / cellSize); 
  numRows = floor(height / cellSize);
  
  grid = createRandomGrid(numCols, numRows, percentWalls);
}

function mousePressed() {

//Start the mic when the mouse is pressed (for permissions)
  mic = new p5.AudioIn();
  
 //Assisted by  
  userStartAudio();
  if (!mic.started){
    mic.start();
  }
}
