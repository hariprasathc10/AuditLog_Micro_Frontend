import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import Sidebar, { DRAWER_WIDTH } from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
 
// ---------- Page title map ----------
const PAGE_TITLES = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users':     'Manage Users',
  '/admin/roles':     'Manage Roles',
}
 
const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
 
  const pageTitle = PAGE_TITLES[location.pathname] || 'Admin'
 
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
 
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
 
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          pageTitle={pageTitle}
        />
 
        {/* Offset for fixed AppBar */}
        <Toolbar />
 
        {/* Page Content */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
 
    </Box>
  )
}
 
export default AdminLayout