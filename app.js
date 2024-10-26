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
// highlight color to show point that piece can move to
let highlightColorMove = "rgb(127 227 107 / 75%)";
let highlightColorAttack = "rgb(255 43 43 / 75%)";
// enum
const PieceType = Object.freeze({
     EMPTY: 'EMPTY',
     // Red side piece
     REDSOLDIER: 'REDSOLDIER',
     REDCANNON: 'REDCANNON',
     REDCHARIOT: 'REDCHARIOT',
     REDHORSE: 'REDHORSE',
     REDELEPHANT: 'REDELEPHANT',
     REDGUARD: 'REDGUARD',
     REDGENERAL: 'REDGENERAL',
     // Black side piece
     BLACKSOLDIER: 'BLACKSOLDIER',
     BLACKCANNON: 'BLACKCANNON',
     BLACKCHARIOT: 'BLACKCHARIOT',
     BLACKHORSE: 'BLACKHORSE',
     BLACKELEPHANT: 'BLACKELEPHANT',
     BLACKGUARD: 'BLACKGUARD',
     BLACKGENERAL: 'BLACKGENERAL',

})
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
          this.cellLength = cellLength;
          this.width = cellLength * 9;
          this.height = cellLength * 10;
          this.cells = [];
          for (let i = 0; i < 9; i++) {
               this.cells[i] = [];
               for (let j = 0; j < 10; j++) {
                    this.cells[i][j] = PieceType.EMPTY;
               }
          }
          this.margin = cellLength / 2;
          this.setPiece();
     }
     setPiece() {
          // Black side
          this.cells[0][0] = PieceType.BLACKCHARIOT;
          this.cells[1][0] = PieceType.BLACKHORSE;
          this.cells[2][0] = PieceType.BLACKELEPHANT;

          this.cells[3][0] = PieceType.BLACKGUARD;
          this.cells[4][0] = PieceType.BLACKGENERAL;
          this.cells[5][0] = PieceType.BLACKGUARD;

          this.cells[6][0] = PieceType.BLACKELEPHANT;
          this.cells[7][0] = PieceType.BLACKHORSE;
          this.cells[8][0] = PieceType.BLACKCHARIOT;

          this.cells[0][3] = PieceType.BLACKSOLDIER;
          this.cells[1][2] = PieceType.BLACKCANNON;
          this.cells[2][3] = PieceType.BLACKSOLDIER;
          this.cells[4][3] = PieceType.BLACKSOLDIER;
          this.cells[6][3] = PieceType.BLACKSOLDIER;
          this.cells[7][2] = PieceType.BLACKCANNON;
          this.cells[8][3] = PieceType.BLACKSOLDIER;
          // Red side
          this.cells[0][9] = PieceType.REDCHARIOT;
          this.cells[1][9] = PieceType.REDHORSE;
          this.cells[2][9] = PieceType.REDELEPHANT;
          this.cells[3][9] = PieceType.REDGUARD;

          this.cells[4][9] = PieceType.REDGENERAL;

          this.cells[5][9] = PieceType.REDGUARD;
          this.cells[6][9] = PieceType.REDELEPHANT;
          this.cells[7][9] = PieceType.REDHORSE;
          this.cells[8][9] = PieceType.REDCHARIOT;

          this.cells[0][6] = PieceType.REDSOLDIER;
          this.cells[1][7] = PieceType.REDCANNON;
          this.cells[2][6] = PieceType.REDSOLDIER;
          this.cells[4][6] = PieceType.REDSOLDIER;
          this.cells[6][6] = PieceType.REDSOLDIER;
          this.cells[7][7] = PieceType.REDCANNON;
          this.cells[8][6] = PieceType.REDSOLDIER;
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
     }
     drawSinglePiece(type) {
          switch (type) {
               // Red piece
               case PieceType.REDSOLDIER:
                    return redSoldierImage;
               case PieceType.REDCANNON:
                    return redCannonImage;
               case PieceType.REDCHARIOT:
                    return redChariotImage;
               case PieceType.REDHORSE:
                    return redHorseImage;
               case PieceType.REDELEPHANT:
                    return redElephantImage;
               case PieceType.REDGUARD:
                    return redGuardImage;
               case PieceType.REDGENERAL:
                    return redGeneralImage;
              // Black piece
               case PieceType.BLACKSOLDIER:
                    return blackSoldierImage;
               case PieceType.BLACKCANNON:
                    return blackCannonImage;
               case PieceType.BLACKCHARIOT:
                    return blackChariotImage;
               case PieceType.BLACKHORSE:
                    return blackHorseImage;
               case PieceType.BLACKELEPHANT:
                    console.log("??");
                    return blackElephantImage;
               case PieceType.BLACKGUARD:
                    return blackGuardImage;
               case PieceType.BLACKGENERAL:
                    return blackGeneralImage;
          }
     }
     drawPieces(board) {
          let cells = board.cells;
          for (let i = 0; i < cells.length; i++) {
               for (let j = 0; j < cells[i].length; j++) {
                    if (cells[i][j] === PieceType.EMPTY)
                         continue;
                    let image = this.drawSinglePiece(cells[i][j]);
                    let x = i * board.cellLength;
                    let y = j * board.cellLength;
                    this.context.drawImage(image, x, y, board.cellLength, board.cellLength);
               }
          }
     }
     highlightPoints(points) {
          this.context.fillStyle = highlightColorMove;
          for (let i = 0; i < points.length; i++) {
               let x = points[i].x * board.cellLength;
               let y = points[i].y * board.cellLength;
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

const board = new Board(50);
const canvas = new Canvas(document.getElementById("mainCanvas"));

blackGeneralImage.onload = () => {
     canvas.setCanvasSize(board);
     canvas.drawBoard(board);
     canvas.drawPieces(board);
}