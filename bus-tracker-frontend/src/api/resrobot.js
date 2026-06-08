import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({ baseURL: '/api' })
const searchCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const getCachedOrFetch = async (key, fetchFn) => {
  const cached = searchCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  const data = await fetchFn()
  searchCache.set(key, { data, timestamp: Date.now() })
  return data
}

export const searchStops = async (query) => {
  return getCachedOrFetch(`stops:${query}`, async () => {
    const { data } = await api.get('/stops/search', { params: { query } })
    return data
  })
}

export const getDepartures = async (stopId, max = 20) => {
  const { data } = await api.get('/departures', { params: { stopId, max } })
  return data
}

export const getArrivals = async (stopId, max = 20) => {
  const { data } = await api.get('/arrivals', { params: { stopId, max } })
  return data
}

export const getRoute = async (originStopId, destinationStopId) => {
  const { data } = await api.get('/routes', {
    params: { originStopId, destinationStopId }
  })
  return data
}

export const clearSearchCache = () => {
  searchCache.clear()
}
