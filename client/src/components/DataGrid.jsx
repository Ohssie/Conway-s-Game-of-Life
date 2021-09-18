import React, { Component } from 'react'
import './grid.css'

class Cell extends React.Component {

  render() {
    const { x, y } = this.props;
    return (
      <div className="Cell" style={{
        left: `${this.props.CELL_SIZE * x + 1}px`,
        top: `${this.props.CELL_SIZE * y + 1}px`,
        width: `${this.props.CELL_SIZE - 1}px`,
        height: `${this.props.CELL_SIZE - 1}px`,
      }} />
    );
  }
}

class DataGrid extends Component {

  constructor() {
    super();
    this.board = [];
  }

  state = {
    cells: [],
    isRunning: false,
    interval: 1000,
    rows: 0,
    cols: 0,
    HEIGHT: 0,
    WIDTH: 0,
    CELL_SIZE: 0
  }

  componentDidMount = async () => {
    console.log('component did mount call')
    let CELL_SIZE;

    if(this.props.data.length <= 100) {
      CELL_SIZE = 15
    } else if (100 < this.props.data.length <= 1000 ) {
      CELL_SIZE = 5
    }
    let WIDTH = (this.props.data.length) * CELL_SIZE;
    let HEIGHT = (this.props.data.reduce((x, y) => Math.max(x, y.length), 0)) * CELL_SIZE;

    this.setState({ rows: HEIGHT / CELL_SIZE, cols: WIDTH / CELL_SIZE, HEIGHT: HEIGHT, WIDTH: WIDTH, CELL_SIZE: CELL_SIZE })

    this.board = this.props.data
    this.setState({ cells: this.makeCells() });
  }

  makeEmptyBoard() {
    let board = [];
    for (let y = 0; y < this.state.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.state.cols; x++) {
        board[y][x] = 0;
      }
    }
    return board;
  }

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
    for (let y = 0; y < this.state.rows; y++) {
      for (let x = 0; x < this.state.cols; x++) {
        if (this.board[y][x] === 1) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }

  handleClick = (event) => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    
    const x = Math.floor(offsetX / this.state.CELL_SIZE);
    const y = Math.floor(offsetY / this.state.CELL_SIZE);
    console.log({x, y}, this.state.CELL_SIZE)

    if (x >= 0 && x <= this.state.cols && y >= 0 && y <= this.state.rows) {
      this.board[y][x] = this.board[y][x] === 1 ? 0 : 1;
    }
    let cells = this.makeCells()
    
    this.setState({ cells });
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

    for (let y = 0; y < this.state.rows; y++) {
      for (let x = 0; x < this.state.cols; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = 1;
          } else {
            newBoard[y][x] = 0;
          }
        } else {
          if (!this.board[y][x] && neighbors === 3) {
            newBoard[y][x] = 1;
          }
        }
      }
    }
    
    try {
      localStorage.setItem('grid', JSON.stringify(newBoard))
    } catch (error) {
      console.log('unable to save to persistent storage')
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

      if (x1 >= 0 && x1 < this.state.cols && y1 >= 0 && y1 < this.state.rows && board[y1][x1]) {
        neighbors++;
      }
    }
    return neighbors;
  }

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  }

  handleClear = () => {
    this.board = this.makeEmptyBoard();
    localStorage.clear()
    this.props.setGridData(null)
  }

  render() {
    const { cells, interval, isRunning, WIDTH, HEIGHT, CELL_SIZE } = this.state;
    console.log('in the render')
    return (
      <div>
        <div className="Board"
          style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
          onClick={this.handleClick}
          ref={(n) => { this.boardRef = n; }}>

          {cells.map(cell => (
              <Cell x={cell.x} y={cell.y} CELL_SIZE={CELL_SIZE} key={`${cell.x},${cell.y}`}/>
          ))}
        </div>

        <div className="controls">
          Update every <input value={this.state.interval} onChange={this.handleIntervalChange} /> msec
          {isRunning ?
            <button className="button" onClick={this.stopGame}>Stop</button> :
            <button className="button" onClick={this.runGame}>Run</button>
          }
          <button className="button" onClick={this.handleClear}>Clear</button>
        </div>
      </div>
    );
  } 
}

export default DataGrid