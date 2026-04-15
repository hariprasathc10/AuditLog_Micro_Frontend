import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginService } from '../services/authService'
import {
  saveToken, saveUser,
  getToken,  getUser,
  clearAuth
} from '../utils/helpers'
import { ROLE_REDIRECTS } from '../utils/constants'
 
const AuthContext = createContext(null)
 
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(getUser())   // ✅ restore on load
  const [token,   setToken]   = useState(getToken())
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
 
  const navigate = useNavigate()
 
  const login = async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginService(username, password)
 
      const userData = {
        id:         data.id,
        username:   data.username,
        email:      data.email,
        role:       data.role,
        firstLogin: data.firstLogin,
      }
 
      // ✅ Save to localStorage FIRST before navigate
      saveToken(data.token)
      saveUser(userData)
 
      // ✅ Set state BEFORE navigate so ResetPasswordPage finds user
      setToken(data.token)
      setUser(userData)
 
      if (data.firstLogin) {
        navigate('/reset-password')
      } else {
        navigate(ROLE_REDIRECTS[data.role] || '/login')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }
 
  const logout = () => {
    clearAuth()
    setToken(null)
    setUser(null)
    navigate('/login')
  }
 
  // Restore session on refresh
  useEffect(() => {
    const storedUser  = getUser()
    const storedToken = getToken()
    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    }
  }, [])
 
  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
 
export const useAuth = () => useContext(AuthContext)
export default AuthContext