const Simulation  = require('../models/model')


const startSimulation = async (req, res) => {
   const body = req.body
   if (!body) {
    return res.status(400).json({
      success: false,
      error: 'Please fill the form.'
    })
  }

  const length = body.length
  const width = body.width

  console.log({ length, width})

  const board = await generateBoard(length, width);
  const result = await saveSimulation(board)
  console.log({ board, result })
  
  // return res.status(201).json({ simulation })
  // return board;
}

const saveSimulation = (arr) => {
  const body = {}
  body.data = arr
  console.log('this is the data >', body)

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an array of elements'
    })
  }

  const simulation = new Simulation(body);
  console.log('checking the simulation')
  console.log({simulation})
  if (!simulation) return res.status(400).json({ success: false, error: err})

  simulation.save()
            .then(() => {
              console.log('Simulation was stored successfully', simulation)
              return simulation
              // return res.status(201).json({ simulation })
              
            })
            .catch(error => {
              console.error('Failed to save simulation', error)
              // return res.status(400).json({ error, message: "Failed to create simulation" })
            })
}

const getSimulations = async (req, res) => {
  await Simulation.find({}, (err, simulations) => {
    if (err) {
      return res.status(400).json({ success: false, error: err})
    }
    if (!simulations.length) {
      return res.status(404).json({ success: false, error: "Simulations not found"})
    }
    return res.status(200).json({ success: true, data: simulations })
  }).catch(error => console.log(error))
}

// Generate a board
const generateBoard = async (height, width) => {
  let board = []

  for (let i = 0; i < height; i++) {
    let row = [];
    for (var j = 0; j < width; j++) {
      row.push(Math.round(Math.random()));
    }
    board[i] = row;
  }
  return board
}

const nextGeneration = async (board) => {
  let initialGrid = board;

  // Deep copying the initial array to avoid overwriting the initial onemptied
  let newGeneration = JSON.parse(JSON.stringify(initialGrid));

  // Getting the length of the array and subarrays
  let lenX = initialGrid.length;
  let lenY = initialGrid.reduce((x, y) => Math.max(x, y.length), 0);

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
      if ((element == 1) && (aliveNeighbors < 2)) {
        newGeneration[i][j] = 0
      } else if ((element == 1) && (aliveNeighbors > 3)) {
        // Killed by the crowd
        newGeneration[i][j] = 0
      } else if ((element == 0) && (aliveNeighbors == 3)) {
        // Resurrection time!
        newGeneration[i][j] = 1
      } else {
        // Live your life
        newGeneration[i][j] = initialGrid[i][j]
      }
    }
  }
  return newGeneration;
}

module.exports = {
  getSimulations,
  startSimulation,
  nextGeneration
}