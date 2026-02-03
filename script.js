/* BUTTONS */
    // When click button, toggle it's border and turn off border of other buttons if coloured

let wallButtonPressed = false;
let sourceButtonPressed = false;
let endButtonPressed = false;
let runButtonPressed = false;

// wallButton
document.getElementById("wallButton").addEventListener('click', wallButtonHandler);

function wallButtonHandler() {
  if (runButtonPressed) return;
  else if (wallButtonPressed == false) {
    wallButtonPressed = true;
    document.getElementById("wallButton").style.border = 'red solid 5px';
    if (sourceButtonPressed) {
      sourceButtonPressed = false;
      document.getElementById("sourceButton").style.border = '0px';
    }
    if (endButtonPressed) {
      endButtonPressed = false;
      document.getElementById("endButton").style.border = '0px';
    }
  }
  else {
    wallButtonPressed = false;
    document.getElementById("wallButton").style.border = '0px';
  }
}

// sourceButton

document.getElementById("sourceButton").addEventListener('click', sourceButtonHandler);

function sourceButtonHandler() {
  if (runButtonPressed) return;
  else if (sourceButtonPressed == false) {
    sourceButtonPressed = true;
    document.getElementById("sourceButton").style.border = 'red solid 5px';
    if (wallButtonPressed) {
      wallButtonPressed = false;
      document.getElementById("wallButton").style.border = '0px';
    }
    if (endButtonPressed) {
      endButtonPressed = false;
      document.getElementById("endButton").style.border = '0px';
    }
  }
  else {
    sourceButtonPressed = false;
    document.getElementById("sourceButton").style.border = '0px';
  }
}

// endButton

document.getElementById("endButton").addEventListener('click', endButtonHandler);

function endButtonHandler() {
  if (runButtonPressed) return;
  else if (endButtonPressed == false) {
    endButtonPressed = true;
    document.getElementById("endButton").style.border = 'red solid 5px';
    if (wallButtonPressed) {
      wallButtonPressed = false;
      document.getElementById("wallButton").style.border = '0px';
    }
    if (sourceButtonPressed) {
      sourceButtonPressed = false;
      document.getElementById("sourceButton").style.border = '0px';
    }
  }
  else {
    endButtonPressed = false;
    document.getElementById("endButton").style.border = '0px';
  }
}

// runButton

document.getElementById("runButton").addEventListener('click', runButtonHandler);

function runButtonHandler() {
  runButtonPressed = true;
  document.getElementById("runButton").style.border = 'red solid 5px';
  if (wallButtonPressed) {
    wallButtonPressed = false;
    document.getElementById("wallButton").style.border = '0px';
  }
  if (sourceButtonPressed) {
    sourceButtonPressed = false;
    document.getElementById("sourceButton").style.border = '0px';
  }
  if (endButtonPressed) {
    endButtonPressed = false;
    document.getElementById("endButton").style.border = '0px';
  }

  const {visitedNodes, path} = BFS(grid, `${startPos.row}-${startPos.col}`, `${endPos.row}-${endPos.col}`);
  
  visitedNodes.shift();
  const switchColorIndex = visitedNodes.length - 1;
  const allVisits = visitedNodes.concat(path);
  scheduleTileColours(allVisits, switchColorIndex);
}

function scheduleTileColours(allVisits, switchColorIndex) {
  allVisits.forEach((e, i) => {
      const div = document.getElementById(e);
      if (i < switchColorIndex) {
        setTimeout(() => {
          div.style.backgroundColor = 'yellow';
        }, 100 * i);
      }
      else if (i == switchColorIndex) {
        setTimeout(() => {
          div.style.backgroundColor = 'yellow';
          div.style.border = 'brown 5px solid';
        }, 100 * i);
      }
      else {
        setTimeout(() => {
          div.style.backgroundColor = 'brown';
        }, 100 * i);
      }
    })
}

/* PATHFINDING ALGORITHM */

// Searches graph in a layered way
// Returns (1) ordered list of visited nodes and (2) ordered list of found path from start node to end node
  // If doesn't find path (i.e., tried to find path but failed), the returned path (represented as a list) is empty
function BFS(grid, startNode, endNode) {
  const {visitedNodes, parentToChild} = BFSHelper(grid, startNode, endNode);
  return constructPath(visitedNodes, parentToChild, startNode, endNode);
}

function BFSHelper(grid, startNode, endNode) {
  visitedNodes = [startNode];
  parentToChild = new Map();
  let currentParentIndex = 0;
  while (currentParentIndex < visitedNodes.length) {
    const neighbourNodes = getNeighbourNodes(visitedNodes[currentParentIndex], grid);
    for (const node of neighbourNodes) {
      if (!visitedNodes.includes(node)) {
        visitedNodes.push(node);
        parentToChild.set(node, visitedNodes[currentParentIndex]);
      }
      if (node == endNode) return {visitedNodes, parentToChild};
    }
    currentParentIndex++;
  }
  return {visitedNodes, parentToChild};
}

function getNeighbourNodes(node, grid) {
  const row = parseInt(node.substring(0, node.indexOf('-')));
  const col = parseInt(node.substring(node.indexOf('-') + 1));
  const neighbours = [];
  if (row != 0 && grid[row - 1][col] != 'wall')
    neighbours.push(`${row - 1}-${col}`);
  if (col != grid[0].length - 1 && grid[row][col + 1] != 'wall')
    neighbours.push(`${row}-${col + 1}`);
  if (row != grid.length - 1 && grid[row + 1][col] != 'wall')
    neighbours.push(`${row + 1}-${col}`);
  if (col != 0 && grid[row][col - 1] != 'wall')
    neighbours.push(`${row}-${col - 1}`);
  return neighbours;
}

function constructPath(visitedNodes, parentToChild, startNode, endNode) {
  if (visitedNodes[visitedNodes.length - 1] != endNode) {
    return { visitedNodes: visitedNodes, path: [] };
  }
  const path = [];
  let child = endNode;
  while (parentToChild.get(child) != startNode) {
    const parent = parentToChild.get(child);
    path.push(parent);
    child = parent;
  }
  path.reverse();
  return {visitedNodes, path};
}

/* GRID */

let grid = [
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free'],
  ['free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free', 'free']
];

let startPos = {
  row : -1,
  col : -1
}

let endPos = {
  row : -1,
  col : -1
}

for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 10; col++) {
    document.getElementById(`${row}-${col}`).addEventListener('click', tileHandler)
  }
}

function tileHandler() {
  // wrt "this" keyword which is used in the following two lines: for now, take the observation of "this" refers to, within the context of this handler, the HTML element that the handler was associated with
  let row = this.id.substring(0, this.id.indexOf('-'));
  let col = this.id.substring(this.id.indexOf('-') + 1, this.id.length);

  if (wallButtonPressed) {
    if (grid[row][col] == 'free') {
      grid[row][col] = 'wall';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'black';
    }
    else if (grid[row][col] == 'wall') { // is 'wall'
      grid[row][col] = 'free';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'lightblue';
    }
    else if (grid[row][col] == 'start') {
      startPos.row = -1;
      startPos.col = -1;
      grid[row][col] = 'wall';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'black';
    }
    else { // is 'end'
      endPos.row = -1;
      endPos.col = -1;
      grid[row][col] = 'wall';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'black';
    }
  }
  else if (sourceButtonPressed) {
    if (grid[row][col] == 'free' || grid[row][col] == 'wall') {
      grid[row][col] = 'start';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'green';
      if (startPos.row != -1) { // if already start position on another tile, then reset its colour
        document.getElementById(`${startPos.row}-${startPos.col}`).style.backgroundColor = 'lightblue';
        grid[startPos.row][startPos.col] = 'free';
      }
      startPos.row = row;
      startPos.col = col;
    }
    else if (grid[row][col] == 'start') {
      grid[row][col] = 'free';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'lightblue';
      startPos.row = -1;
      startPos.col = -1;
    }
    else { // is 'end'
      grid[row][col] = 'start';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'green';
      if (startPos.row != -1) { // if already start position on another tile, then reset its colour
        document.getElementById(`${startPos.row}-${startPos.col}`).style.backgroundColor = 'lightblue';
        grid[startPos.row][startPos.col] = 'free';
      }
      startPos.row = row;
      startPos.col = col;
      endPos.row = -1;
      endPos.col = -1;
    }
  }
  else if (endButtonPressed) {
    if (grid[row][col] == 'free' || grid[row][col] == 'wall') {
      if (endPos.row != -1) { // reset old end tile if it exists
        document.getElementById(`${endPos.row}-${endPos.col}`).style.backgroundColor = 'lightblue';
        grid[endPos.row][endPos.col] = 'free';
      }
      // set current tile to be the end tile
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'blue';
      grid[row][col] = 'end';
      endPos.row = row;
      endPos.col = col;
    }
    else if (grid[row][col] == 'start') {
      grid[row][col] = 'end';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'blue';
      if (endPos.row != -1) {
        document.getElementById(`${endPos.row}-${endPos.col}`).style.backgroundColor = 'lightblue';
        grid[endPos.row][endPos.row] = 'free';
      }
      startPos.row = -1;
      startPos.col = -1;
      endPos.row = row;
      endPos.col = col;
    }
    else { // is 'end'
      grid[row][col] = 'free';
      document.getElementById(`${row}-${col}`).style.backgroundColor = 'lightblue';
      endPos.row = -1;
      endPos.col = -1;
    }
  }
}
