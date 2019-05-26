import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Popup from "reactjs-popup";

// single coin spot
function CoinSpot(props) {
  return (
    <div className="coin-spot">
      <button className={props.value} />
    </div>
  );
}

// Popup component with game rules
const PopupRules =  () => (
  <Popup trigger={<button> How to Play </button>} position="bottom center">
    <div>
    The object of Connect Four is to get four stones of your own color (red or yellow) in a row, horizontal, vertical or diagonal. Every turn a player places a stone on the board.
    Red moves first; moves are made alternatively, one by turn.

Moves entails in placing new pieces on the board; pieces slide downwards from upper holes, falling down to the last row or piling up on the last piece introduced in the same column. So, in every turn the introduced piece may be placed at most on seven different squares.

The winner is the first player who gets a straight line made with four own pieces and no gaps between them.
    </div>
  </Popup>
)

// Our board component
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinSpots: create2DArray(),
      player1: true
    };
  }
  //
  updateColumn(i) {
    const coins = this.state.coinSpots.slice();
    for (let index = 5; index >= 0; index--) {
      if (coins[i][index] !== "red" && coins[i][index] !== "yellow") {
        coins[i][index] = this.state.player1 ? "red" : "yellow";
        return coins;
      }
    }
    return coins;
  }

  handleClick(i) {
    if (checkWinner(this.state.coinSpots)){
      return;
    }
    if (this.isFullColumn(i)) {
      alert("Read the game rules under 'How to play' button. You have to choose a column with empty spaces");
      return;
    }
    let spots = this.updateColumn(i);
    this.setState({
      coinSpots: spots,
      player1: !this.state.player1
    });
  }

  isFullColumn(i) {
    for (let index = 5; index >= 0; index--) {
      if (this.state.coinSpots[i][index] === 0) {
        return false;
      }
    }
    return true;
  }

  renderCoinSpot(i, y) {
    return <CoinSpot value={this.state.coinSpots[i][y] || "white"} />;
  }

  renderColumn(i) {
    return (
      <div className="board-row" onClick={() => this.handleClick(i)}>
        {this.renderCoinSpot(i, 0)}
        {this.renderCoinSpot(i, 1)}
        {this.renderCoinSpot(i, 2)}
        {this.renderCoinSpot(i, 3)}
        {this.renderCoinSpot(i, 4)}
        {this.renderCoinSpot(i, 5)}
      </div>
    );
  }

  restartGame() {
    this.setState({
      coinSpots: create2DArray(),
      player1: true
    });
  }

  

  render() {
    let status = this.state.player1
      ? `Now it's red's turn`
      : `Now it's yellow's turn`;
    const winner = checkWinner(this.state.coinSpots);
    return (
      <div>
        <div className="buttons">
          <button className="reset-btn" onClick={() => this.restartGame()}>
            New Game
          </button>
          <PopupRules />
        </div>
        <div className="game-board">
          {this.renderColumn(0)}
          {this.renderColumn(1)}
          {this.renderColumn(2)}
          {this.renderColumn(3)}
          {this.renderColumn(4)}
          {this.renderColumn(5)}
          {this.renderColumn(6)}
        </div>
        {!winner ? (
          <div>
            <h2 className="status">
              {status}
                <svg height="50" width="50">
                  <circle cx="30" cy="30" r="20" stroke="none" fill={status === `Now it's red's turn` ? "red" : "yellow"} />
                </svg>
            </h2>
          </div>
        ) : (winner === "It's a Tie") ? (
          <h2 className="winner">{winner}<svg height="50" width="50">
                  <circle cx="30" cy="30" r="20" stroke="none" fill='red'/>
                </svg>
                <svg height="50" width="50">
                  <circle cx="30" cy="30" r="20" stroke="none" fill='yellow'/>
                </svg></h2>
        ) : (
          <h2 className="winner">The winner is {winner}<svg height="50" width="50">
                  <circle cx="30" cy="30" r="20" stroke="none" fill={winner === 'red' ? "red" : "yellow"}/>
                </svg></h2>
        )}
      </div>
      
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="Title">
          <h1>Connect 4 Game</h1>
        </div>
        <div>
          <Board />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

function create2DArray() {
  let board = new Array(7);
  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(6).fill(0);
  }
  return board;
}

function checkWinner(board) {
  return (
    checkVertical(board) ||
    checkDiagonalRight(board) ||
    checkDiagonalLeft(board) ||
    checkHorizontal(board) ||
    checkTie(board)
  );
}

function checkTie(board) {
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 6; c++) {
      if(!board[r][c]) {
        return false;
      }
    }
  }
  return "It's a Tie";
}

function checkVertical(board) {
  // Check only if row is 3 or greater
  for (let r = 3; r < 7; r++) {
    for (let c = 0; c < 6; c++) {
      if (board[r][c]) {
        if (
          board[r][c] === board[r - 1][c] &&
          board[r][c] === board[r - 2][c] &&
          board[r][c] === board[r - 3][c]
        ) {
          return board[r][c];
        }
      }
    }
  }
}

function checkHorizontal(board) {
  // Check only if column is 3 or less
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c]) {
        if (
          board[r][c] === board[r][c + 1] &&
          board[r][c] === board[r][c + 2] &&
          board[r][c] === board[r][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
  }
}

function checkDiagonalRight(board) {
  // Check only if row is 3 or greater AND column is 3 or less
  for (let r = 3; r < 7; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c]) {
        if (
          board[r][c] === board[r - 1][c + 1] &&
          board[r][c] === board[r - 2][c + 2] &&
          board[r][c] === board[r - 3][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
  }
}

function checkDiagonalLeft(board) {
  // Check only if row is 3 or greater AND column is 3 or greater
  for (let r = 3; r < 7; r++) {
    for (let c = 3; c < 6; c++) {
      if (board[r][c]) {
        if (
          board[r][c] === board[r - 1][c - 1] &&
          board[r][c] === board[r - 2][c - 2] &&
          board[r][c] === board[r - 3][c - 3]
        ) {
          return board[r][c];
        }
      }
    }
  }
}
