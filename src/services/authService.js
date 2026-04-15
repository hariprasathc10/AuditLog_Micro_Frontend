import axiosInstance from '../api/axiosInstance'
import axios         from 'axios'
 
export const login = async (username, password) => {
  const response = await axiosInstance.post('/api/auth/login', {
    username,
    password,
  })
  return response.data
}
 
// ✅ Use plain axios — NO token, NO interceptors
export const resetPassword = async (username, newPassword) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password?username=${encodeURIComponent(username)}`,
    { newPassword },
    { headers: { 'Content-Type': 'application/json' } }
  )
  return response.data
}