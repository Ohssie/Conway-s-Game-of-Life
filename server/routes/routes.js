const express = require('express')

const Controller = require('../controllers/controller')
const router = express.Router();

router.get('/simulations', Controller.getSimulations);
router.post('/simulation', Controller.startSimulation);
router.post('/simulation/next', Controller.nextGeneration);

module.exports = router