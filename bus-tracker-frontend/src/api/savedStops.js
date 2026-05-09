import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getSavedStops = async () => {
  const { data } = await api.get('/SavedStops')
  return data
}

export const addSavedStop = async (stop) => {
  const { data } = await api.post('/SavedStops', {
    stopId: stop.id || stop.extId,
    stopExtId: stop.extId || stop.id,
    stopName: stop.name
  })
  return data
}

export const deleteSavedStop = async (id) => {
  await api.delete(`/SavedStops/${id}`)
}
