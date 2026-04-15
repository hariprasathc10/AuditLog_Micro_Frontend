import axiosInstance from '../api/axiosInstance'
 
// ==================== PROJECTS ====================
 
export const getMyProjects = async () => {
  try {
    const response = await axiosInstance.get('/api/manager/projects')
    return Array.isArray(response.data) ? response.data : []
  } catch (err) {
    console.error('❌ getMyProjects:', err.response?.data || err.message)
    throw err
  }
}
 
// ✅ Alias
export const getManagerProjects = getMyProjects
 
export const createProject = async (projectData) => {
  try {
    const response = await axiosInstance.post('/api/manager/projects', projectData)
    return response.data
  } catch (err) {
    console.error('❌ createProject:', err.response?.data || err.message)
    throw err
  }
}
 
export const updateProject = async (id, projectData) => {
  try {
    const response = await axiosInstance.put(
      `/api/manager/projects/${id}`,
      projectData
    )
    return response.data
  } catch (err) {
    console.error('❌ updateProject:', err.response?.data || err.message)
    throw err
  }
}
 
export const deleteProject = async (id) => {
  try {
    await axiosInstance.delete(`/api/manager/projects/${id}`)
  } catch (err) {
    console.error('❌ deleteProject:', err.response?.data || err.message)
    throw err
  }
}
 
// ==================== ISSUES ====================
 
export const getAllIssues = async () => {
  try {
    const response = await axiosInstance.get('/api/manager/issues')
    return Array.isArray(response.data) ? response.data : []
  } catch (err) {
    console.error('❌ getAllIssues:', err.response?.data || err.message)
    throw err
  }
}
 
// ✅ Alias
export const getManagerIssues = getAllIssues
 
export const createIssue = async (issueData) => {
  // ✅ Ensure correct field names matching Spring Boot DTO
  const payload = {
    title:           issueData.title?.trim()           || '',
    description:     issueData.description?.trim()     || '',
    projectId:       issueData.projectId
                       ? Number(issueData.projectId)
                       : null,
    employeeId:      issueData.employeeId
                       ? Number(issueData.employeeId)
                       : null,
    status:          issueData.status                  || 'OPEN',
    progressDetails: issueData.progressDetails?.trim() || '',
    currentTask:     issueData.currentTask?.trim()     || '',
  }
 
  console.log('📤 createIssue payload:', payload) // ✅ debug log
 
  try {
    const response = await axiosInstance.post('/api/manager/issues', payload)
    return response.data
  } catch (err) {
    console.error('❌ createIssue error:', err.response?.status, err.response?.data)
    throw err
  }
}
 
export const updateIssue = async (id, issueData) => {
  const payload = {
    title:           issueData.title?.trim()           || '',
    description:     issueData.description?.trim()     || '',
    projectId:       issueData.projectId
                       ? Number(issueData.projectId)
                       : null,
    employeeId:      issueData.employeeId
                       ? Number(issueData.employeeId)
                       : null,
    status:          issueData.status                  || 'OPEN',
    progressDetails: issueData.progressDetails?.trim() || '',
    currentTask:     issueData.currentTask?.trim()     || '',
  }
 
  console.log(`📤 updateIssue [${id}] payload:`, payload) // ✅ debug log
 
  try {
    const response = await axiosInstance.put(
      `/api/manager/issues/${id}`,
      payload
    )
    return response.data
  } catch (err) {
    console.error('❌ updateIssue error:', err.response?.status, err.response?.data)
    throw err
  }
}
 
export const deleteIssue = async (id) => {
  try {
    await axiosInstance.delete(`/api/manager/issues/${id}`)
  } catch (err) {
    console.error('❌ deleteIssue:', err.response?.data || err.message)
    throw err
  }
}
 
// ==================== EMPLOYEES ====================
 
export const getAvailableEmployees = async () => {
  try {
    const response = await axiosInstance.get('/api/manager/employees')
    return Array.isArray(response.data) ? response.data : []
  } catch (err) {
    console.error('❌ getAvailableEmployees:', err.response?.data || err.message)
    throw err
  }
}
 
export const assignEmployee = async (issueId, employeeId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/manager/issues/${issueId}/assign?employeeId=${employeeId}`
    )
    return response.data
  } catch (err) {
    console.error('❌ assignEmployee:', err.response?.data || err.message)
    throw err
  }
}