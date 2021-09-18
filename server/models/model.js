const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Simulation = new Schema(
  {
    data: { type: [Array], required: true }
  },
  { timestamps: true }
)
Simulation.index({ data: '2d' })

module.exports = mongoose.model('simulation', Simulation)