import axios       from 'axios'
import { getToken, clearAuth } from '../utils/helpers'
 
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
 
// Request — attach JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
 
// Response — auto logout ONLY if not on reset-password
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
 
      // ✅ Don't clear session if user is resetting password
      if (currentPath !== '/reset-password') {
        clearAuth()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
 
export default axiosInstance