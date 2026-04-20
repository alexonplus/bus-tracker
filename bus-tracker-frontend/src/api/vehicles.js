import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getVehiclePositions = async () => {
  const { data } = await api.get('/vehicles')
  return data
}
