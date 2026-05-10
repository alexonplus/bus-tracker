import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getEvents = async () => {
  const { data } = await api.get('/Events')
  return data
}

export const createEvent = async (event) => {
  const { data } = await api.post('/Events', event)
  return data
}

export const deleteEvent = async (id) => {
  await api.delete(`/Events/${id}`)
}

export const setAttendance = async (eventId, status, rating = null, lookingForCompany = false) => {
  await api.post(`/Events/${eventId}/attend`, { status, rating, lookingForCompany })
}
