import { useEffect, useState } from 'react'
import { Grid, Typography, Box, Alert } from '@mui/material'
import TaskIcon        from '@mui/icons-material/Task'
import OpenInNewIcon   from '@mui/icons-material/OpenInNew'
import HourglassIcon   from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon      from '@mui/icons-material/Cancel'
import StatCard        from '../../components/common/StatCard'
import LoadingSpinner  from '../../components/common/LoadingSpinner'
import { getMyIssues } from '../../services/employeeService'
 
const EmployeeDashboard = () => {
  const [issues,  setIssues]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyIssues()
        setIssues(data)
      } catch {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
 
  if (loading) return <LoadingSpinner message="Loading dashboard..." />
 
  const total      = issues.length
  const open       = issues.filter(i => i.status === 'OPEN').length
  const inProgress = issues.filter(i => i.status === 'INPROGRESS').length
  const resolved   = issues.filter(i => i.status === 'RESOLVED').length
  const closed     = issues.filter(i => i.status === 'CLOSED').length
 
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#1a1a2e" mb={3}>
        My Overview
      </Typography>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assigned"
            value={total}
            icon={<TaskIcon />}
            color="#1a1a2e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open"
            value={open}
            icon={<OpenInNewIcon />}
            color="#e53935"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={inProgress}
            icon={<HourglassIcon />}
            color="#fb8c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={resolved}
            icon={<CheckCircleIcon />}
            color="#43a047"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Closed"
            value={closed}
            icon={<CancelIcon />}
            color="#757575"
          />
        </Grid>
      </Grid>
    </Box>
  )
}
 
export default EmployeeDashboard