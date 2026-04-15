// ---------- LocalStorage Keys ----------
export const TOKEN_KEY = 'lats_token'
export const USER_KEY  = 'lats_user'
 
// ---------- Role Redirects ----------
export const ROLE_REDIRECTS = {
  ADMIN:    '/admin/dashboard',
  MANAGER:  '/manager/dashboard',
  EMPLOYEE: '/employee/dashboard',
  AUDITOR:  '/auditor/dashboard',
}
 
// ---------- Role Colors ----------
export const ROLE_COLORS = {
  ADMIN:    'error',
  MANAGER:  'primary',
  EMPLOYEE: 'success',
  AUDITOR:  'warning',
}
 
// ---------- Issue Status Colors ----------
// ✅ Keys match backend IssueStatus enum exactly
export const STATUS_COLORS = {
  OPEN:        'error',
  IN_PROGRESS: 'warning',   // ✅ fixed from INPROGRESS
  RESOLVED:    'success',
  CLOSED:      'default',
  BLOCKED:     'error',     // ✅ added — backend has this
}
 
// ✅ Aliases
export const ISSUE_STATUS_COLORS = STATUS_COLORS
export const ISSUE_STATUS_COLOR  = STATUS_COLORS
 
// ---------- Action Type Colors ----------
export const ACTION_COLORS = {
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
 
// ---------- Issue Statuses (for dropdowns) ----------
// ✅ Values match backend IssueStatus enum exactly
export const ISSUE_STATUSES = [
  { value: 'OPEN',        label: 'Open'        },
  { value: 'IN_PROGRESS', label: 'In Progress' }, // ✅ fixed
  { value: 'RESOLVED',    label: 'Resolved'    },
  { value: 'CLOSED',      label: 'Closed'      },
  { value: 'BLOCKED',     label: 'Blocked'     }, // ✅ added
]
 
// ✅ Aliases
export const ISSUE_STATUS   = ISSUE_STATUSES
export const ISSUE_OPTIONS  = ISSUE_STATUSES
 
// ---------- All Roles (for dropdowns) ----------
export const ROLES = [
  { value: 'ADMIN',    label: 'Admin'    },
  { value: 'MANAGER',  label: 'Manager'  },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'AUDITOR',  label: 'Auditor'  },
]
 
// ---------- Pagination ----------
export const DEFAULT_PAGE_SIZE = 10
 