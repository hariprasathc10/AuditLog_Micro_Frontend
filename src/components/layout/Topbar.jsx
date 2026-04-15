import {
  AppBar, Toolbar, Typography, IconButton,
  Box, Tooltip, Avatar, Menu, MenuItem, Divider
} from '@mui/material'
import MenuIcon        from '@mui/icons-material/Menu'
import LogoutIcon      from '@mui/icons-material/Logout'
import LockResetIcon   from '@mui/icons-material/LockReset'
import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../../context/AuthContext'
import { DRAWER_WIDTH } from './Sidebar'
 
// ---------- Role colors (must match Sidebar) ----------
const ROLE_COLORS = {
  ADMIN:    '#e53935',
  MANAGER:  '#1e88e5',
  EMPLOYEE: '#43a047',
  AUDITOR:  '#fb8c00',
}
 
const Topbar = ({ onMenuClick, pageTitle = 'Dashboard' }) => {
  const { user, logout }   = useAuth()
  const navigate            = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
 
  const roleColor = ROLE_COLORS[user?.role] || '#1976d2'
 
  const handleOpenMenu  = (e) => setAnchorEl(e.currentTarget)
  const handleCloseMenu = ()  => setAnchorEl(null)
 
  const handleResetPassword = () => {
    handleCloseMenu()
    navigate('/reset-password')
  }
 
  const handleLogout = () => {
    handleCloseMenu()
    logout()
  }
 
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml:    { md: `${DRAWER_WIDTH}px` },
        backgroundColor: '#fff',
        color: '#333',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
 
        {/* ---------- Left: Hamburger + Title ---------- */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" color="#1a1a2e">
            {pageTitle}
          </Typography>
        </Box>
 
        {/* ---------- Right: Avatar Menu ---------- */}
        <Tooltip title="Account">
          <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 36, height: 36,
                backgroundColor: roleColor,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
 
        {/* ---------- Dropdown Menu ---------- */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              {user?.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
 
          <Divider />
 
          <MenuItem onClick={handleResetPassword}>
            <LockResetIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
            Reset Password
          </MenuItem>
 
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
            Logout
          </MenuItem>
        </Menu>
 
      </Toolbar>
    </AppBar>
  )
}
 
export default Topbar