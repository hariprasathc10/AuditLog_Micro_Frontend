import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, Toolbar } from '@mui/material'
import Sidebar, { DRAWER_WIDTH } from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
 
const PAGE_TITLES = {
  '/manager/dashboard': 'Manager Dashboard',
  '/manager/projects':  'Projects',
  '/manager/issues':    'Issues',
  '/manager/assign':    'Assign Employee',
}
 
const ManagerLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
 
  const pageTitle = PAGE_TITLES[location.pathname] || 'Manager'
 
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
 
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
 
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
 
        <Toolbar />
 
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
 
    </Box>
  )
}
 
export default ManagerLayout