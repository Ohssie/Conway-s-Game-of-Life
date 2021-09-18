import React, { Component, useRef, useEffect } from 'react'
import api from '../api'
import './grid.css'

const data = [
  [ 1, 0, 0, 1, 0,1, 0, 0, 1, 0 ],
  [ 1, 1, 1, 0, 1,1, 0, 0, 1, 0 ],
  [ 0, 0, 0, 0, 1,1, 0, 0, 1, 0 ],
  [ 1, 0, 0, 1, 0,1, 0, 0, 1, 0 ],
  [ 1, 1, 0, 1, 1,1, 0, 0, 1, 0 ],
  [ 0, 0, 0, 1, 1,1, 0, 0, 1, 0 ],
  [ 0, 1, 1, 1, 1,1, 0, 0, 1, 0 ],
  [ 1, 0, 1, 0, 1,1, 0, 0, 0, 0 ],
  [ 1, 1, 1, 1, 0,1, 0, 0, 1, 0 ],
  [ 1, 0, 0, 0, 1,1, 0, 0, 1, 0 ]
];

let CELL_SIZE;

if(data.length <= 100) {
  CELL_SIZE = 20
} else if (100 < data.length <= 1000 ) {
  CELL_SIZE = 5
}
let WIDTH = (data.length) * CELL_SIZE;
let HEIGHT = (data.reduce((x, y) => Math.max(x, y.length), 0)) * CELL_SIZE;
// const WIDTH = 800;
// const HEIGHT = 800;

class Cell extends React.Component {

  render() {
    const { x, y } = this.props;
    return (
      <div className="Cell" style={{
        left: `${CELL_SIZE * x + 1}px`,
        top: `${CELL_SIZE * y + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }} />
    );
  }
}


class DataGrid extends Component {

  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;

    // this.board = this.makeEmptyBoard();
    this.board = []
  }

  

  state = {
      cells: [],
      isRunning: false,
      interval: 100,
  }
  componentDidMount = async () => {
    this.board = data
    this.setState({ cells: this.makeCells() });
  }
  // console.log(`this is the board`)

  // makeEmptyBoard() {
  //   let board = [];
  //   for (let y = 0; y < this.rows; y++) {
  //     board[y] = [];
  //     for (let x = 0; x < this.cols; x++) {
  //       board[y][x] = false;
  //     }
  //   }

  //   return board;
  // }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop,
    };
  }

  makeCells() {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {

          cells.push({ x, y });
        }
      }
    }
    console.log({cells})

    return cells;
  }

  handleClick = (event) => {

    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.makeCells() });
  }

  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  }

    stopGame = () => {
        this.setState({ isRunning: false });
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    }

    runIteration() {
      let newBoard = this.makeEmptyBoard();

      for (let y = 0; y < this.rows; y++) {
          for (let x = 0; x < this.cols; x++) {
              let neighbors = this.calculateNeighbors(this.board, x, y);
              if (this.board[y][x]) {
                  if (neighbors === 2 || neighbors === 3) {
                      newBoard[y][x] = true;
                  } else {
                      newBoard[y][x] = false;
                  }
              } else {
                  if (!this.board[y][x] && neighbors === 3) {
                      newBoard[y][x] = true;
                  }
              }
          }
      }

      this.board = newBoard;
      this.setState({ cells: this.makeCells() });

      this.timeoutHandler = window.setTimeout(() => {
          this.runIteration();
      }, this.state.interval);
  }

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board 
   * @param {int} x 
   * @param {int} y 
   */
  calculateNeighbors(board, x, y) {
      let neighbors = 0;
      const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
      for (let i = 0; i < dirs.length; i++) {
          const dir = dirs[i];
          let y1 = y + dir[0];
          let x1 = x + dir[1];

          if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
              neighbors++;
          }
      }

      return neighbors;
  }
  // componentDidMount = async () => {
  //   this.setState({ isLoading: true })
    
  //   console.log('inside the other component', this.props.data)

  //   // await api.getAllSimulations().then(simulations => {
  //   //   console.log({simulations})
  //   //   this.setState({
  //   //     simulations: simulations.data.data,
  //   //     isLoading: false
  //   //   })
  //   // })
  // }

  // componentDidUpdate = async () => {

  // }

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  }

  // handleClear = () => {
  //     this.board = this.makeEmptyBoard();
  //     this.setState({ cells: this.makeCells() });
  // }

  handleRandom = () => {
      for (let y = 0; y < this.rows; y++) {
          for (let x = 0; x < this.cols; x++) {
              // this.board[y][x] = (Math.random() >= 0.5);
              this.board[y][x] = data[y][x]
          }
      }

      this.setState({ cells: this.makeCells() });
  }


  render() {
    const { cells, interval, isRunning } = this.state;
        return (
            <div>
                <div className="Board"
                    style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n; }}>

                    {cells.map(cell => (
                        <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>
                    ))}
                </div>

                <div className="controls">
                    Update every <input value={this.state.interval} onChange={this.handleIntervalChange} /> msec
                    {isRunning ?
                        <button className="button" onClick={this.stopGame}>Stop</button> :
                        <button className="button" onClick={this.runGame}>Run</button>
                    }
                    <button className="button" onClick={this.handleRandom}>Random</button>
                    {/* <button className="button" onClick={this.handleClear}>Clear</button> */}
                </div>
            </div>
        );
  } 
}

export default DataGrid