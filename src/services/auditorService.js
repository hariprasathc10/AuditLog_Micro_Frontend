import axiosInstance from '../api/axiosInstance'
 
// ✅ Fetch all pages and combine
export const getAuditLogs = async () => {
  const response = await axiosInstance.get(
    '/api/auditor/audit-logs?page=0&size=1000&sort=timestamp,desc'
  )
  // ✅ Backend returns paginated — extract content array
  const data = response.data
  if (data && Array.isArray(data.content)) {
    return data.content
  }
  if (Array.isArray(data)) {
    return data
  }
  return []
}
 
export const getAuditLogsByUser = async (userId) => {
  const response = await axiosInstance.get(
    `/api/auditor/audit-logs?userId=${userId}&size=1000`
  )
  const data = response.data
  return data?.content ?? data ?? []
}
 
export const getAuditLogsByAction = async (action) => {
  const response = await axiosInstance.get(
    `/api/auditor/audit-logs?action=${action}&size=1000`
  )
  const data = response.data
  return data?.content ?? data ?? []
}
 