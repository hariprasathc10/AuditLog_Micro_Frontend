import { TOKEN_KEY, USER_KEY } from './constants'
 
// ---------- Token Helpers ----------
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}
 
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}
 
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}
 
// ---------- User Helpers ----------
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
 
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}
 
export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}
 
// ---------- Auth Clear ----------
export const clearAuth = () => {
  removeToken()
  removeUser()
}
 
// ---------- Date Formatter ----------
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('en-IN', {
      day:    '2-digit',
      month:  'short',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}
 
// ---------- Role Label ----------
export const getRoleLabel = (role) => {
  const map = {
    ADMIN:    'Admin',
    MANAGER:  'Manager',
    EMPLOYEE: 'Employee',
    AUDITOR:  'Auditor',
  }
  return map[role] || role || '—'
}
 
// ---------- Status Label ----------
export const getStatusLabel = (status) => {
  const map = {
    OPEN:       'Open',
    INPROGRESS: 'In Progress',
    RESOLVED:   'Resolved',
    CLOSED:     'Closed',
  }
  return map[status] || status || '—'
}
 
// ---------- Role Color (MUI Chip color) ----------
export const getRoleColor = (role) => {
  const map = {
    ADMIN:    'error',
    MANAGER:  'primary',
    EMPLOYEE: 'success',
    AUDITOR:  'warning',
  }
  return map[role] || 'default'
}
 
// ---------- Status Color (MUI Chip color) ----------
export const getStatusColor = (status) => {
  const map = {
    OPEN:       'error',
    INPROGRESS: 'warning',
    RESOLVED:   'success',
    CLOSED:     'default',
  }
  return map[status] || 'default'
}
 
// ---------- Action Color (MUI Chip color) ----------
export const getActionColor = (action) => {
  if (!action) return 'default'
  const map = {
    LOGIN:          'success',
    LOGOUT:         'default',
    CREATE:         'primary',
    UPDATE:         'warning',
    DELETE:         'error',
    ASSIGN:         'info',
    STATUS_UPDATE:  'warning',
    RESET_PASSWORD: 'secondary',
    ACTIVATE:       'success',
    DEACTIVATE:     'error',
  }
  for (const key of Object.keys(map)) {
    if (action.toUpperCase().includes(key)) return map[key]
  }
  return 'default'
}
 
// ---------- Truncate Text ----------
export const truncate = (str, length = 40) => {
  if (!str) return '—'
  return str.length > length
    ? str.substring(0, length) + '...'
    : str
}
 
// ---------- Capitalize First Letter ----------
export const capitalize = (str) => {
  if (!str) return '—'
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
 
// ---------- Get Initials (for Avatar) ----------
export const getInitials = (name) => {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}
 