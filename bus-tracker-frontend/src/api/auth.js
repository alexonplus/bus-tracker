import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const login = async (email, password) => {
  const { data } = await api.post('/Auth/login', { email, password })
  localStorage.setItem('token', data.token)
  return data
}

export const register = async (name, email, password) => {
  const { data } = await api.post('/Auth/register', { name, email, password })
  localStorage.setItem('token', data.token)
  return data
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const getToken = () => localStorage.getItem('token')

export const isAuthenticated = () => !!localStorage.getItem('token')
