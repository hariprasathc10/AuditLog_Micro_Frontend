import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider, Avatar
} from '@mui/material'
 
// Icons
import DashboardIcon        from '@mui/icons-material/Dashboard'
import PeopleIcon           from '@mui/icons-material/People'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import FolderIcon           from '@mui/icons-material/Folder'
import BugReportIcon        from '@mui/icons-material/BugReport'
import AssignmentIndIcon    from '@mui/icons-material/AssignmentInd'
import TaskIcon             from '@mui/icons-material/Task'
import HistoryIcon          from '@mui/icons-material/History'
 
const DRAWER_WIDTH = 240
 
// ---------- Nav config per role ----------
const NAV_ITEMS = {
  ADMIN: [
    { label: 'Dashboard',  path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Users',      path: '/admin/users',     icon: <PeopleIcon /> },
    { label: 'Roles',      path: '/admin/roles',     icon: <AdminPanelSettingsIcon /> },
  ],
  MANAGER: [
    { label: 'Dashboard',  path: '/manager/dashboard', icon: <DashboardIcon /> },
    { label: 'Projects',   path: '/manager/projects',  icon: <FolderIcon /> },
    { label: 'Issues',     path: '/manager/issues',    icon: <BugReportIcon /> },
    { label: 'Assign',     path: '/manager/assign',    icon: <AssignmentIndIcon /> },
  ],
  EMPLOYEE: [
    { label: 'Dashboard',  path: '/employee/dashboard', icon: <DashboardIcon /> },
    { label: 'My Issues',  path: '/employee/issues',    icon: <TaskIcon /> },
  ],
  AUDITOR: [
    { label: 'Dashboard',  path: '/auditor/dashboard', icon: <DashboardIcon /> },
    { label: 'Audit Logs', path: '/auditor/logs',      icon: <HistoryIcon /> },
  ],
}
 
// ---------- Role badge colors ----------
const ROLE_COLORS = {
  ADMIN:    '#e53935',
  MANAGER:  '#1e88e5',
  EMPLOYEE: '#43a047',
  AUDITOR:  '#fb8c00',
}
 
const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
 
  const navItems = NAV_ITEMS[user?.role] || []
  const roleColor = ROLE_COLORS[user?.role] || '#1976d2'
 
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1a1a2e',
        color: '#fff',
      }}
    >
      {/* ---------- Brand ---------- */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36,
            borderRadius: 2,
            backgroundColor: roleColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: 18, color: '#fff',
          }}
        >
          L
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#fff">
          LATS
        </Typography>
      </Box>
 
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
 
      {/* ---------- User Info ---------- */}
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 38, height: 38,
            backgroundColor: roleColor,
            fontSize: 16,
          }}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight="bold" color="#fff">
            {user?.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: roleColor,
              color: '#fff',
              px: 1, py: 0.2,
              borderRadius: 1,
              fontSize: 10,
            }}
          >
            {user?.role}
          </Typography>
        </Box>
      </Box>
 
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />
 
      {/* ---------- Nav Items ---------- */}
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); onClose?.() }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? roleColor : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? roleColor
                      : 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
 
      {/* ---------- Footer ---------- */}
      <Box sx={{ px: 3, py: 2 }}>
        <Typography variant="caption" color="rgba(255,255,255,0.3)">
          © 2026 LATS System
        </Typography>
      </Box>
    </Box>
  )
 
  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
 
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
 
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
 
    </Box>
  )
}
 
export { DRAWER_WIDTH }
export default Sidebar