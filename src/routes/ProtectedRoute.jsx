import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
 
const ProtectedRoute = () => {
  const { token } = useAuth()
 
  // If no token, redirect to login
  if (!token) {
    return <navigate to="/login" replace />
  }
 
  // Render nested routes
  return <Outlet />
}
 
export default ProtectedRoute