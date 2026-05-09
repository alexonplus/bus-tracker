import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getUsers = async () => {
  const { data } = await api.get('/Admin/users')
  return data
}

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/Admin/users/${id}/role`, { role })
  return data
}
