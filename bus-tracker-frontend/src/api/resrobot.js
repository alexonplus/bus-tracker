import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const searchStops = async (query) => {
  const { data } = await api.get('/stops/search', { params: { query } })
  return data
}

export const getDepartures = async (stopId, max = 20) => {
  const { data } = await api.get('/departures', { params: { stopId, max } })
  return data
}
