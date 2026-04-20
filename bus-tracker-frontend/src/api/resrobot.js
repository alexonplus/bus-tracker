import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const searchStops = async (query) => {
  const { data } = await api.get('/stops/search', { params: { query } })
  return data
}

export const getDepartures = async (stopId, max = 20) => {
  const { data } = await api.get('/departures', { params: { stopId, max } })
  return data
}
