import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export const getAllSimulations = () => api.get(`/simulations`);
export const startSimulation = payload => api.post(`/simulation`, payload);
export const nextGeneration = payload => api.post(`/simulation/next`, payload)

const apis = {
  getAllSimulations,
  startSimulation,
  nextGeneration
}

export default apis;