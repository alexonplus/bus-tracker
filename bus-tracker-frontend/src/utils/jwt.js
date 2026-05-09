import { getToken } from '../api/auth'

export function getTokenPayload() {
  const token = getToken()
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function isAdmin() {
  const payload = getTokenPayload()
  if (!payload) return false
  const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  return role === 'Admin'
}
