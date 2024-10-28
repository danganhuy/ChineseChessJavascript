// Image
const boardImage = new Image();
const redSoldierImage = new Image();
const redCannonImage = new Image();
const redChariotImage = new Image();
const redHorseImage = new Image();
const redElephantImage = new Image();
const redGuardImage = new Image();
const redGeneralImage = new Image();
const blackSoldierImage = new Image();
const blackCannonImage = new Image();
const blackChariotImage = new Image();
const blackHorseImage = new Image();
const blackElephantImage = new Image();
const blackGuardImage = new Image();
const blackGeneralImage = new Image();
const selectedPieceImage = new Image();
// Image source
boardImage.src = "images/BanCoTuong.png";
redSoldierImage.src = "images/redSoldier.png";
redCannonImage.src = "images/redCannon.png";
redChariotImage.src = "images/redChariot.png";
redHorseImage.src = "images/redHorse.png";
redElephantImage.src = "images/redElephant.png";
redGuardImage.src = "images/redGuard.png";
redGeneralImage.src = "images/redGeneral.png";
blackSoldierImage.src = "images/blackSoldier.png";
blackCannonImage.src = "images/blackCannon.png";
blackChariotImage.src = "images/blackChariot.png";
blackHorseImage.src = "images/blackHorse.png";
blackElephantImage.src = "images/blackElephant.png";
blackGuardImage.src = "images/blackGuard.png";
blackGeneralImage.src = "images/blackGeneral.png";
selectedPieceImage.src = "images/selectedPiece.png";
// highlight color to show point that piece can move to
let highlightColorMove = "rgba(62,255,0,0.5)";
let highlightColorAttack = "rgba(255,0,0,0.5)";
// Hold x,y coordinate
class Point {
     constructor(x, y) {
          this.x = x;
          this.y = y;
     }
}
// Contain broad data
class Board {
     constructor(cellLength) {
          // Calculate board size
          this.cellLength = cellLength;
          this.width = cellLength * 9;
          this.height = cellLength * 10;
          // Create cells
          this.cells = [];
          for (let i = 0; i < 9; i++) {
               this.cells[i] = [];
               for (let j = 0; j < 10; j++) {
                    this.cells[i][j] = null;
               }
          }
          // For finding cell position
          this.margin = cellLength / 2;
          this.setPiece();

          this.turn = true;
          this.selectedPoint = null;
          this.validMoves = [];
          this.validAttacks = [];
     }
     setSPoint(x,y) {
          this.selectedPoint = new Point(x,y);
     }
     getSPoint() {
          return this.cells[this.selectedPoint.x][this.selectedPoint.y];
     }
     setPiece() {
          // Red side
          this.cells[0][9] = new Chariot(true);
          this.cells[1][9] = new Horse(true);
          this.cells[2][9] = new Elephant(true);
          this.cells[3][9] = new Guard(true);
          this.cells[4][9] = new General(true);
          this.cells[5][9] = new Guard(true);
          this.cells[6][9] = new Elephant(true);
          this.cells[7][9] = new Horse(true);
          this.cells[8][9] = new Chariot(true);

          this.cells[0][6] = new Soldier(true);
          this.cells[1][7] = new Cannon(true);
          this.cells[2][6] = new Soldier(true);
          this.cells[4][6] = new Soldier(true);
          this.cells[6][6] = new Soldier(true);
          this.cells[7][7] = new Cannon(true);
          this.cells[8][6] = new Soldier(true);

          // Black side
          this.cells[0][0] = new Chariot(false);
          this.cells[1][0] = new Horse(false);
          this.cells[2][0] = new Elephant(false);
          this.cells[3][0] = new Guard(false);
          this.cells[4][0] = new General(false);
          this.cells[5][0] = new Guard(false);
          this.cells[6][0] = new Elephant(false);
          this.cells[7][0] = new Horse(false);
          this.cells[8][0] = new Chariot(false);

          this.cells[0][3] = new Soldier(false);
          this.cells[1][2] = new Cannon(false);
          this.cells[2][3] = new Soldier(false);
          this.cells[4][3] = new Soldier(false);
          this.cells[6][3] = new Soldier(false);
          this.cells[7][2] = new Cannon(false);
          this.cells[8][3] = new Soldier(false);
     }
     checkIfOutside(x,y) {
          return (x < 0 || x > 8 || y < 0 || y > 9);
     }
     // Action: true if move, false if attack
     // Side: true if red, false if black
     checkPosition(x,y,side) {
          // Position is outside board
          if (this.checkIfOutside(x,y))
               return -1;
          // If there is no piece here
          if (this.cells[x][y] === null)
               return 0;
          // If a piece here is ally or enemy
          if (this.cells[x][y].side !== side)
               return 1;
          else
               return 2;
     }
     movePiece(xa,ya,xb,yb, action) {
          if (this.cells[xa][ya].side !== this.turn)
               return;

          let points = action ? this.validMoves : this.validAttacks;
          let moved = false;
          for (let i=0; i < points.length; i++) {
               if (xb === points[i].x && yb === points[i].y) {
                    this.cells[xb][yb] = this.cells[xa][ya];
                    this.cells[xa][ya] = null;
                    moved = true;
                    this.turn = !this.turn;
                    break;
               }
          }
          if (moved) {
               this.performAction(xa,ya,-1);
          }
     }
     performAction(x,y,action) {
          // action: -1 if unselect, 0 if select, 1 if move, 2 if attack
          switch (action) {
               case -1:
                    this.selectedPoint = null;
                    this.validMoves = [];
                    this.validAttacks = [];
                    break;
               case 0:
                    this.setSPoint(x,y);
                    this.validMoves = this.getSPoint().getValidMove(board,x,y);
                    this.validAttacks = this.getSPoint().getValidAttack(board,x,y);
                    break;
               case 1:
                    this.movePiece(this.selectedPoint.x, this.selectedPoint.y, x, y, true);
                    break;
               case 2:
                    this.movePiece(this.selectedPoint.x, this.selectedPoint.y, x, y, false);
                    break;
          }
     }
     selectPiece(x,y) {
          if (this.selectedPoint == null) {
               // Select a piece
               if (this.cells[x][y] != null) {
                    if (this.cells[x][y].side === this.turn)
                         this.performAction(x,y,0);
               }
               else {
               }
          }
          else {
               // Move piece
               if (this.cells[x][y] === null) {
                    this.performAction(x,y,1);
               }
               // Select same piece to unselect
               else if (this.getSPoint() === this.cells[x][y]) {
                    this.performAction(x,y,-1);
               }
               // Attack opponent piece
               else if (this.getSPoint().side !== this.cells[x][y].side) {
                    this.performAction(x,y,2);
               }
               // Select another ally piece
               else {
                    this.performAction(x,y,0);
               }
          }
     }
}
// Piece class
class Piece {
     constructor(side) {
          // True if red, false if black
          this.side = side;
     }
     getValidMove(board,x,y) {}
     getValidAttack(board,x,y) {}
     getPieceImage() {
          return null;
     }
     riverCheck(y) {
          if (this.side)
               return y < 5;
          else
               return y > 4;
     }
     palaceCheck(x,y) {
          if (this.side)
               return y > 6 && x > 2 && x < 6;
          else
               return y < 3 && x > 2 && x < 6;
     }
}
class Soldier extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          if (this.side) {
               if (board.checkPosition(x,y-1,this.side) === 0)
                    points.push(new Point(x,y-1))
               if (y < 5) {
                    if (board.checkPosition(x-1,y,this.side) === 0)
                         points.push(new Point(x-1,y))
                    if (board.checkPosition(x+1,y,this.side) === 0)
                         points.push(new Point(x+1,y))
               }
          }
          else {
               if (board.checkPosition(x,y+1,this.side) === 0)
                    points.push(new Point(x,y+1))
               if (y > 4) {
                    if (board.checkPosition(x-1,y,this.side) === 0)
                         points.push(new Point(x-1,y))
                    if (board.checkPosition(x+1,y,this.side) === 0)
                         points.push(new Point(x+1,y))
               }
          }
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          let direc = this.side ? -1 : 1;
          if (board.checkPosition(x,y+direc,this.side) === 1)
               points.push(new Point(x,y+direc))
          if (this.riverCheck(y)) {
               if (board.checkPosition(x-1,y,this.side) === 1)
                    points.push(new Point(x-1,y))
               if (board.checkPosition(x+1,y,this.side) === 1)
                    points.push(new Point(x+1,y))
          }
          return points;
     }
     getPieceImage() {
          return this.side ? redSoldierImage : blackSoldierImage;
     }
}
class Cannon extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          let x2,y2;
          function check(x,y,side) {
               if (board.checkPosition(x,y,side) === 0)
                    points.push(new Point(x,y));
               else
                    return true;
               return false;
          }
          x2 = x; y2 = y;
          while (true) {
               y2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               y2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               x2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               x2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          let x2,y2;
          let canAttack;
          function check(x,y,side) {
               if (board.checkPosition(x,y,side) === -1)
                    return true;
               if (!canAttack) {
                    if (board.checkPosition(x,y,side) > 0)
                         canAttack = true;
               }
               else {
                    if (board.checkPosition(x,y,side) === 1) {
                         points.push(new Point(x,y));
                         return true;
                    }
                    else if (board.checkPosition(x,y,side) === 2) {
                         return true;
                    }
               }
               return false;
          }
          x2 = x; y2 = y; canAttack = false;
          while (true) {
               y2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y; canAttack = false;
          while (true) {
               y2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y; canAttack = false;
          while (true) {
               x2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y; canAttack = false;
          while (true) {
               x2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          return points;
     }
     getPieceImage() {
          return this.side ? redCannonImage : blackCannonImage;
     }
}
class Chariot extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          let x2,y2;
          function check(x,y,side) {
               if (board.checkPosition(x,y,side) === 0)
                    points.push(new Point(x,y));
               else
                    return true;
               return false;
          }
          x2 = x; y2 = y;
          while (true) {
               y2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               y2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               x2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               x2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          let x2,y2;
          function check(x,y,side) {
               if (board.checkPosition(x2,y2,side) === 1) {
                    points.push(new Point(x2,y2));
                    return true;
               }
               else if (board.checkPosition(x2,y2,side) !== 0)
                    return true;
               return false;
          }
          x2 = x; y2 = y;
          while (true) {
               y2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               y2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               x2 ++;
               if (check(x2,y2,this.side))
                    break;
          }
          x2 = x; y2 = y;
          while (true) {
               x2 --;
               if (check(x2,y2,this.side))
                    break;
          }
          return points;
     }
     getPieceImage() {
          return this.side ? redChariotImage : blackChariotImage;
     }
}
class Horse extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          // Up
          if (board.checkPosition(x,y+1,this.side) === 0) {
               if (board.checkPosition(x-1,y+2,this.side) === 0)
                    points.push(new Point(x-1,y+2));
               if (board.checkPosition(x+1,y+2,this.side) === 0)
                    points.push(new Point(x+1,y+2));
          }
          // Down
          if (board.checkPosition(x,y-1,this.side) === 0) {
               if (board.checkPosition(x-1,y-2,this.side) === 0)
                    points.push(new Point(x-1,y-2));
               if (board.checkPosition(x+1,y-2,this.side) === 0)
                    points.push(new Point(x+1,y-2));
          }
          // Right
          if (board.checkPosition(x+1,y,this.side) === 0) {
               if (board.checkPosition(x+2,y-1,this.side) === 0)
                    points.push(new Point(x+2,y-1));
               if (board.checkPosition(x+2,y+1,this.side) === 0)
                    points.push(new Point(x+2,y+1));
          }
          // Left
          if (board.checkPosition(x-1,y,this.side) === 0) {
               if (board.checkPosition(x-2,y-1,this.side) === 0)
                    points.push(new Point(x-2,y-1));
               if (board.checkPosition(x-2,y+1,this.side) === 0)
                    points.push(new Point(x-2,y+1));
          }
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          // Up
          if (board.checkPosition(x,y+1,this.side) === 0) {
               if (board.checkPosition(x-1,y+2,this.side) === 1)
                    points.push(new Point(x-1,y+2));
               if (board.checkPosition(x+1,y+2,this.side) === 1)
                    points.push(new Point(x+1,y+2));
          }
          // Down
          if (board.checkPosition(x,y-1,this.side) === 0) {
               if (board.checkPosition(x-1,y-2,this.side) === 1)
                    points.push(new Point(x-1,y-2));
               if (board.checkPosition(x+1,y-2,this.side) === 1)
                    points.push(new Point(x+1,y-2));
          }
          // Right
          if (board.checkPosition(x+1,y,this.side) === 0) {
               if (board.checkPosition(x+2,y-1,this.side) === 1)
                    points.push(new Point(x+2,y-1));
               if (board.checkPosition(x+2,y+1,this.side) === 1)
                    points.push(new Point(x+2,y+1));
          }
          // Left
          if (board.checkPosition(x-1,y,this.side) === 0) {
               if (board.checkPosition(x-2,y-1,this.side) === 1)
                    points.push(new Point(x-2,y-1));
               if (board.checkPosition(x-2,y+1,this.side) === 1)
                    points.push(new Point(x-2,y+1));
          }
          return points;
     }
     getPieceImage() {
          return this.side ? redHorseImage : blackHorseImage;
     }
}
class Elephant extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          if (board.checkPosition(x+2,y+2,this.side) === 0 && !this.riverCheck(y+2))
               points.push(new Point(x+2,y+2));
          if (board.checkPosition(x+2,y-2,this.side) === 0 && !this.riverCheck(y-2))
               points.push(new Point(x+2,y-2));
          if (board.checkPosition(x-2,y+2,this.side) === 0 && !this.riverCheck(y+2))
               points.push(new Point(x-2,y+2));
          if (board.checkPosition(x-2,y-2,this.side) === 0 && !this.riverCheck(y-2))
               points.push(new Point(x-2,y-2));
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          if (board.checkPosition(x+2,y+2,this.side) === 1 && !this.riverCheck(y+2))
               points.push(new Point(x+2,y+2));
          if (board.checkPosition(x+2,y-2,this.side) === 1 && !this.riverCheck(y-2))
               points.push(new Point(x+2,y-2));
          if (board.checkPosition(x-2,y+2,this.side) === 1 && !this.riverCheck(y+2))
               points.push(new Point(x-2,y+2));
          if (board.checkPosition(x-2,y-2,this.side) === 1 && !this.riverCheck(y-2))
               points.push(new Point(x-2,y-2));
          return points;
     }
     getPieceImage() {
          return this.side ? redElephantImage : blackElephantImage;
     }
}
class Guard extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          if (board.checkPosition(x+1,y+1,this.side) === 0 && this.palaceCheck(x+1,y+1))
               points.push(new Point(x+1,y+1));
          if (board.checkPosition(x-1,y+1,this.side) === 0 && this.palaceCheck(x-1,y+1))
               points.push(new Point(x-1,y+1));
          if (board.checkPosition(x+1,y-1,this.side) === 0 && this.palaceCheck(x+1,y-1))
               points.push(new Point(x+1,y-1));
          if (board.checkPosition(x-1,y-1,this.side) === 0 && this.palaceCheck(x-1,y-1))
               points.push(new Point(x-1,y-1));
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          if (board.checkPosition(x+1,y+1,this.side) === 1 && this.palaceCheck(x+1,y+1))
               points.push(new Point(x+1,y+1));
          if (board.checkPosition(x-1,y+1,this.side) === 1 && this.palaceCheck(x-1,y+1))
               points.push(new Point(x-1,y+1));
          if (board.checkPosition(x+1,y-1,this.side) === 1 && this.palaceCheck(x+1,y-1))
               points.push(new Point(x+1,y-1));
          if (board.checkPosition(x-1,y-1,this.side) === 1 && this.palaceCheck(x-1,y-1))
               points.push(new Point(x-1,y-1));
          return points;
     }
     getPieceImage() {
          return this.side ? redGuardImage : blackGuardImage;
     }
}
class General extends Piece {
     getValidMove(board,x,y) {
          let points = [];
          if (board.checkPosition(x+1,y,this.side) === 0 && this.palaceCheck(x+1,y))
               points.push(new Point(x+1,y));
          if (board.checkPosition(x-1,y,this.side) === 0 && this.palaceCheck(x-1,y))
               points.push(new Point(x-1,y));
          if (board.checkPosition(x,y+1,this.side) === 0 && this.palaceCheck(x,y+1))
               points.push(new Point(x,y+1));
          if (board.checkPosition(x,y-1,this.side) === 0 && this.palaceCheck(x,y-1))
               points.push(new Point(x,y-1));
          return points;
     }
     getValidAttack(board,x,y) {
          let points = [];
          if (board.checkPosition(x+1,y,this.side) === 1 && this.palaceCheck(x+1,y))
               points.push(new Point(x+1,y));
          if (board.checkPosition(x-1,y,this.side) === 1 && this.palaceCheck(x-1,y))
               points.push(new Point(x-1,y));
          if (board.checkPosition(x,y+1,this.side) === 1 && this.palaceCheck(x,y+1))
               points.push(new Point(x,y+1));
          if (board.checkPosition(x,y-1,this.side) === 1 && this.palaceCheck(x,y-1))
               points.push(new Point(x,y-1));
          return points;
     }
     getPieceImage() {
          return this.side ? redGeneralImage : blackGeneralImage;
     }
}
// Handle canvas
class Canvas {
     constructor(element) {
          this.element = element;
          this.context = element.getContext('2d');
     }
     setCanvasSize(board) {
          this.element.width = board.width;
          this.element.height = board.height;
     }
     drawBoard(board) {
          this.context.clearRect(0, 0, board.width, board.height);
          this.context.drawImage(boardImage, 0, 0, board.width, board.height);
          this.drawPieces(board);
     }
     drawPieces(board) {
          let cells = board.cells;
          for (let i = 0; i < cells.length; i++) {
               for (let j = 0; j < cells[i].length; j++) {
                    if (cells[i][j] === null)
                         continue;
                    // let image = this.drawSinglePiece(cells[i][j]);
                    let image = cells[i][j].getPieceImage();
                    let x = i * board.cellLength;
                    let y = j * board.cellLength;
                    this.context.drawImage(image, x, y, board.cellLength, board.cellLength);
               }
          }
     }
     highlightPoints(selected, moves, attacks) {
          let x = selected.x * board.cellLength;
          let y = selected.y * board.cellLength;
          this.context.drawImage(selectedPieceImage, x, y, board.cellLength, board.cellLength);
          this.context.beginPath();
          this.context.fillStyle = highlightColorMove;
          for (let i = 0; i < moves.length; i++) {
               x = moves[i].x * board.cellLength;
               y = moves[i].y * board.cellLength;
               this.context.moveTo(x, y);
               this.context.arc(
                   board.margin + x,
                   board.margin + y,
                   board.cellLength / 5,
                   0, Math.PI * 2, true);
          }
          this.context.fill();
          this.context.beginPath();
          this.context.fillStyle = highlightColorAttack;
          for (let i = 0; i < attacks.length; i++) {
               x = attacks[i].x * board.cellLength;
               y = attacks[i].y * board.cellLength;
               this.context.moveTo(x, y);
               this.context.arc(
                   board.margin + x,
                   board.margin + y,
                   board.cellLength / 5,
                   0, Math.PI * 2, true);
          }
          this.context.fill();
     }
}

function annoucePlayerTurn() {
     turnElement.innerHTML = board.turn ? `Lượt đỏ` : `Lượt đen`;
}

function readMousePosition(event) {
     let x = event.clientX - (window.innerWidth / 2) + (board.width / 2);
     let y = event.clientY - (window.innerHeight / 2) + (board.height / 2);
     x = Math.floor(x / board.cellLength);
     y = Math.floor(y / board.cellLength);
     let point = new Point(x, y);
     board.selectPiece(x,y);

     canvas.drawBoard(board);
     if (board.selectedPoint != null) {
          canvas.highlightPoints(board.selectedPoint, board.validMoves, board.validAttacks);
     }
     annoucePlayerTurn();
}

let totalImage = 16;
let count = 0
function waitImageToLoad() {
     count ++;
     if (count === totalImage) {
          canvas.setCanvasSize(board);
          canvas.drawBoard(board);
          annoucePlayerTurn();
     }
}

const board = new Board(50);
const canvasElement = document.getElementById("mainCanvas");
const turnElement = document.getElementById("playerturn");
const canvas = new Canvas(canvasElement);

boardImage.onload = waitImageToLoad;
redSoldierImage.onload = waitImageToLoad;
redCannonImage.onload = waitImageToLoad;
redChariotImage.onload = waitImageToLoad;
redHorseImage.onload = waitImageToLoad;
redElephantImage.onload = waitImageToLoad;
redGuardImage.onload = waitImageToLoad;
redGeneralImage.onload = waitImageToLoad;
blackSoldierImage.onload = waitImageToLoad;
blackCannonImage.onload = waitImageToLoad;
blackChariotImage.onload = waitImageToLoad;
blackHorseImage.onload = waitImageToLoad;
blackElephantImage.onload = waitImageToLoad;
blackGuardImage.onload = waitImageToLoad;
blackGeneralImage.onload = waitImageToLoad;
selectedPieceImage.onload = waitImageToLoad;

canvasElement.addEventListener("mousedown", readMousePosition);