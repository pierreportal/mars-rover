let orientation = ['N','E','S','W'];
// Rover Object Goes Here
// ======================
var rover1 = {
  name: 'Rover1',
  direction: orientation[0],
  position : {x:0,y:0},
  travelLog : [],
  icon:'🤖',
}
var rover2 = {
  name: 'Rover2',
  direction: orientation[2],
  position : {x:9,y:9},
  travelLog : [],
  icon:'👽',
}
// Setup
let icons = {
  obstacles:'👾',
  gridCase: '➕',
}
var lastPlayed = '';
var grid = createGrid(gridSize=[10,10], nbObstacle=prompt("How many obstacle on the map?"));
// Generate grid with given size and random obstacles
function createGrid(gridSize, nbObstacle){
  var grid = [];
  for(var i=0; i<gridSize[0]; i++) {
      grid[i] = new Array(gridSize[1]).fill(icons.gridCase);
  }
  for(var i = 0; i < nbObstacle; i++){
    var randx = Math.floor((Math.random() * gridSize[0]));// Tried to avoid put obstacle on grid[0][0] and [9][9] but had few errors
    var randy = Math.floor((Math.random() * gridSize[1]));
    grid[randy][randx] = icons.obstacles;
  }
  return grid
}
// ======================

function turnLeft(rover){
  //console.log("turnLeft was called!");
  switch(rover.direction) {
    case 'N':
      rover.direction = orientation[orientation.length-1];
      break;
    default:
      rover.direction = orientation[orientation.indexOf(rover.direction)-1];
  }
  console.log("↬ New",rover.name,"direction: ",rover.direction);
}

function turnRight(rover){
  //console.log("turnRight was called!");
  switch(rover.direction) {
    case 'W':
      rover.direction = orientation[0];
      break;
    default:
      rover.direction = orientation[orientation.indexOf(rover.direction)+1];
  }
  console.log("↬ New rover direction: ",rover.direction);
}

function moveForward(rover){
  //console.log("moveForward was called")
  var newPosition = {x:rover.position.x, y:rover.position.y}
  switch(rover.direction){
    case 'N':
      newPosition.y += 1;
      break;
    case 'S':
      newPosition.y -= 1;     
      break;
    case 'E':     
      newPosition.x += 1;      
      break;
    case 'W':      
      newPosition.x -= 1;      
  }
  actualizePosition(rover, newPosition);
}
function moveBackward(rover){
  //console.log("moveBackward was called")
  var newPosition = {x:rover.position.x, y:rover.position.y}
  switch(rover.direction){
    case 'N':
      newPosition.y -= 1;
      break;
    case 'S':
      newPosition.y += 1;     
      break;
    case 'E':     
      newPosition.x -= 1;      
      break;
    case 'W':      
      newPosition.x += 1;      
  }
  actualizePosition(rover, newPosition);
}
// listOfCommand prompt the commands to user (invalid command will be ignored)
function listOfCommands(rover){
  if (lastPlayed === rover.name){
    console.log("!! Not your turn...");
    return false
  } else {
    // validation of input string, ignoring invalid char
    var string = prompt("Enter command(s) for",rover.name,": ");
    var validRegExp = /[f,b,l,r]/g;
    var validCommand = string.match(validRegExp);
    if(!validCommand){
      console.log('INVALID COMMAND !!');
    } else {
      for (var i = 0; i < validCommand.length; i++){
        if (checkColision(rover)){
          grid[rover.position.x][rover.position.y] === '☠️';
          console.log("☠️☠️☠️ Rover crash !!! ☠️☠️☠️");
          break;
        } else  {
          switch(validCommand[i]){
            case 'f':
              moveForward(rover)
              break;
            case 'b':
              moveBackward(rover)
              break;
            case 'l':
              turnLeft(rover);
              break;
            case 'r':
              turnRight(rover);
          }
        }
      }
    }
  }
  lastPlayed = rover.name;
  console.log("↦ New",rover.name,"position: ",rover.position);
  console.log("\n",gridSize[0],"X",gridSize[1],"Map (North ↑, Est →,",nbObstacle,"Obstacle(s))\n",flip(transpose(grid)),'\n');
}
// separate function to check path of the rover (grid and obstacles) before moving 
function actualizePosition(rover, newPosition){
  if(!(newPosition.x < 10 && newPosition.x > -1 && newPosition.y < 10 && newPosition.y > -1)){
    console.log("⤼ Rover out of the map !");
  } else if(grid[newPosition.x][newPosition.y] === icons.obstacles) {
    console.log("⇥ Obstacle on the map at: ",newPosition);
  } else {
    rover.travelLog.push([rover.position.x, rover.position.y])
    rover.position.x = newPosition.x;
    rover.position.y = newPosition.y;
    grid[rover.position.x][rover.position.y] = rover.icon;
    for (var i = 0; i < rover.travelLog.length; i++){
      grid[rover.travelLog[i][0]][rover.travelLog[i][1]] = rover.icon;
    }
  }
}


function checkColision(rover){
  switch(rover.name){
    case 'Rover1':
      if(rover.position.x === rover2.position.x && rover.position.y === rover2.position.y){
        return true
      } else {
        return false
      }
    case 'Rover2':
      if(rover.position.x === rover1.position.x && rover.position.y === rover1.position.y){
        return true
      } else {
        return false
      }
  }
}

//-----------------------
// Run
//-----------------------


//listOfCommands(rover1);
//listOfCommands(rover2);
grid[0][0] = rover1.icon;
grid[9][9] = rover2.icon;

console.log("\n",gridSize[0],"X",gridSize[1],"Map (North ↑, Est →,",nbObstacle,"Obstacle(s))\n",flip(transpose(grid)),'\n');
console.log("=====================================")
console.log("The grid above can be displayed to have a view on the map, obstacles and rovers.")
console.log("To play, enter the command 'listOfCommand(<rover1 OR rover2>), rover1 and rover2 has to play one after the other or you will get an error message.")
console.log("=====================================")
//console.log("\n---ROVER1 TRAVEL LOG-------------\n",rover1.travelLog,'\n');
//console.log("\n---ROVER2 TRAVEL LOG-------------\n",rover2.travelLog,'\n');

//------------------------
// Had to transpose and flip the displayed matrix grid to get the y-axis vertically. (found the transpose method on Stackoverflow)
//------------------------
function transpose(a) {

  // Calculate the width and height of the Array
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}

function flip(a){
  m = [];
  for(var i = 9; i > -1; i--){
    m.push(a[i])
  }
  return m
}