import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
 
const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth()
 
  // If user's role is not in allowedRoles, redirect to login
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
 
  // Render nested routes
  return <Outlet />
}
 
export default RoleRoute