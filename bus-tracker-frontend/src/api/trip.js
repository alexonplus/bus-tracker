import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const planTrip = async (fromExtId, toExtId, dateTime) => {
  const { data } = await api.get('/Trip', {
    params: { fromExtId, toExtId, dateTime: dateTime.toISOString() }
  })
  return data
}
