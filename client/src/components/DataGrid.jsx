import React, { Component } from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
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
    let CELL_SIZE;
    /** Get a better implementation to handle this */
    if(this.props.data.length <= 50) {
      CELL_SIZE = 30
    } else if(51 <= this.props.data.length <= 100) {
      CELL_SIZE = 15
    } else if (101 <= this.props.data.length <= 1000 ) {
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
    let newBoard = this.board
    // console.log({newBoard})
   
    /** works well for the M*M matrix but not for M*N matrix. Working on the M*N matrix scenario */
    if(this.state.cols === this.state.rows) {
      newBoard = this.nextGeneration(this.board, this.state.rows, this.state.cols)
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

  nextGeneration(board, rows, cols) {
    let initialGrid = board;

  // Deep copying the initial array to avoid overwriting the initial onemptied
  let newBoard = JSON.parse(JSON.stringify(initialGrid));

  // Getting the length of the array and subarrays
  let lenX = rows;
  let lenY = cols;

  for (let i = 1; i < (lenX - 1); i++) {
    for (let j = 1; j < (lenY - 1); j++) {
      let aliveNeighbors = 0;

      // After picking the element, we need to check for the amount of surrounding neighbors alive
      // Doing this, we check the rows above and below and the columns beside the element
      for (let left = -1; left <= 1; left++) {
        for (let right = -1; right <= 1; right++) {
          aliveNeighbors = aliveNeighbors + initialGrid[i + left][j + right]
        }
      }
      aliveNeighbors -= initialGrid[i][j]

      const element = initialGrid[i][j]

      // Die lonely
      if ((element === 1) && (aliveNeighbors < 2)) {
        newBoard[i][j] = 0
      } else if ((element === 1) && (aliveNeighbors > 3)) {
        // Killed by the crowd
        newBoard[i][j] = 0
      } else if ((element === 0) && (aliveNeighbors === 3)) {
        // Resurrection time!
        newBoard[i][j] = 1
      } else {
        // Live your life
        newBoard[i][j] = initialGrid[i][j]
      }
    }
  }
  return newBoard;
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
    const { cells, isRunning, WIDTH, HEIGHT, CELL_SIZE } = this.state;
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

       
        <Form style={{ margin: 10 }}>
          <Form.Group widths={2}>
            <Form.Field>
              <label>Update speed (ms)</label>
              <Input fluid value={this.state.interval} onChange={this.handleIntervalChange} />
            </Form.Field>
          </Form.Group>
        </Form>
        
        {isRunning ?
          <Button color='red' onClick={this.stopGame} style={{ marginLeft: 10 }}>Stop!</Button>:
          <Button color='green' onClick={this.runGame} style={{ marginLeft: 10 }}>Run!</Button>
        }
        <Button color='black' onClick={this.handleClear}>Clear</Button>

      </div>
    );
  } 
}

export default DataGrid