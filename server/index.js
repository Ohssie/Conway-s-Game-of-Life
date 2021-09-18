const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./database')
const simulationRouter = require('./routes/routes')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.send('hello World!')
})
app.use('/api', simulationRouter)

app.listen({ port: 3000 }, () => 
  console.log(`🚀 Server ready at http://localhost:${port}`)
);