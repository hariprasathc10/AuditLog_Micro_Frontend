import axiosInstance from '../api/axiosInstance'
 
// ---------- Users ----------
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/api/admin/users')
  return response.data
}
 
export const createUser = async (userData) => {
  // userData: { username, email, role }
  const response = await axiosInstance.post('/api/admin/users', userData)
  return response.data
}
 
export const updateUserStatus = async (id, active) => {
  const response = await axiosInstance.patch(
    `/api/admin/users/${id}/status?active=${active}`
  )
  return response.data
}
 
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/users/${id}`)
  return response.data
}
 
// ---------- Roles ----------
export const getAllRoles = async () => {
  const response = await axiosInstance.get('/api/admin/roles')
  return response.data
}