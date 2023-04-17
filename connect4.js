  /** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1, p2];
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops.  */

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this);
    
    top.addEventListener("click", this.handleGameClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
    
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
    
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.handleGameClick);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`${this.currPlayer.name} player won!`);
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(color,name) {
    this.color = color;
    this.name = name;
  }
}

document.getElementById('startGame').addEventListener('click', (event) => {
  event.preventDefault();

  //establish players
  let p1 = new Player(document.getElementById('p1color').value,document.getElementById('p1name').value);
  let p2 = new Player(document.getElementById('p2color').value,document.getElementById('p2name').value);


  //color variables
  let p1color = document.getElementById('p1color').value;
  let p2color = document.getElementById('p2color').value;


//name variables
  let p1name = document.getElementById('p1name').value;
  let p2name = document.getElementById('p2name').value;
//div variables
  let p1Div = document.getElementById('p1div');
  let p2Div = document.getElementById('p2div');


  //Add Names
  p1Div.innerText = p1name;
  p1Div.style.backgroundColor = p1color;
  p2Div.innerText = p2name;
  p2Div.style.backgroundColor = p2color;

// //gradient overlay
//   let gradientBg =document.getElementById('gradientBackground2');
//   let gradient = `linear-gradient(to right, ${p1color} 0%, transparent 50%, ${p2color} 100%)`;
//   gradientBg.style.backgroundColor = gradient;




  new Game(p1, p2);
});



let p1ColorPicker = document.getElementById('p1color-picker');
let p1ColorField = document.getElementById('p1color');
let p2ColorPicker = document.getElementById('p2color-picker');
let p2ColorField = document.getElementById('p2color');

//Picker P1
p1ColorPicker.addEventListener('input', (event) => {
  p1ColorField.value = event.target.value;
});

//Field P1
p1ColorField.addEventListener('input', (event) => {
  p1ColorPicker.value = event.target.value;
});

//Picker P2
p2ColorPicker.addEventListener('input', (event) => {
  p2ColorField.value = event.target.value;
});
//Field p2
p2ColorField.addEventListener('input', (event) => {
  p2ColorPicker.value = event.target.value;
});



