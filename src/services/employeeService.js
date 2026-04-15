import axiosInstance from '../api/axiosInstance'
 
// ---------- Issues ----------
export const getMyIssues = async () => {
  const response = await axiosInstance.get('/api/employee/issues')
  return response.data
}
 
export const updateIssueStatus = async (id, statusData) => {
  // statusData: { status, progressDetails, currentTask }
  const response = await axiosInstance.patch(
    `/api/employee/issues/${id}/status`,
    statusData
  )
  return response.data
}