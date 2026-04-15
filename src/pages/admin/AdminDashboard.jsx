import { useEffect, useState } from 'react'
import { Grid, Typography, Box, Alert } from '@mui/material'
import PeopleIcon             from '@mui/icons-material/People'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon             from '@mui/icons-material/Person'
import EngineeringIcon        from '@mui/icons-material/Engineering'
import GavelIcon              from '@mui/icons-material/Gavel'
import StatCard               from '../../components/common/StatCard'
import LoadingSpinner         from '../../components/common/LoadingSpinner'
import { getAllUsers }        from '../../services/adminService'
 
const AdminDashboard = () => {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data.')
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])
 
  if (loading) return <LoadingSpinner message="Loading dashboard..." />
 
  const total     = users.length
  const admins    = users.filter(u => u?.role === 'ADMIN').length
  const managers  = users.filter(u => u?.role === 'MANAGER').length
  const employees = users.filter(u => u?.role === 'EMPLOYEE').length
  const auditors  = users.filter(u => u?.role === 'AUDITOR').length
  const active    = users.filter(u => u?.active === true).length
  const inactive  = users.filter(u => u?.active === false).length
 
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#1a1a2e" mb={3}>
        Overview
      </Typography>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      {/* ✅ MUI v6 Grid — no "item" prop, use size={{}} */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Users"    value={total}     icon={<PeopleIcon />}             color="#1a1a2e" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Admins"         value={admins}    icon={<AdminPanelSettingsIcon />}  color="#e53935" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Managers"       value={managers}  icon={<EngineeringIcon />}         color="#1e88e5" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Employees"      value={employees} icon={<PersonIcon />}              color="#43a047" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Auditors"       value={auditors}  icon={<GavelIcon />}               color="#fb8c00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Users"   value={active}    icon={<PeopleIcon />}              color="#43a047" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Inactive Users" value={inactive}  icon={<PeopleIcon />}              color="#e53935" />
        </Grid>
      </Grid>
    </Box>
  )
}
 
export default AdminDashboard
 