import { useEffect, useState } from 'react'
import { Grid, Typography, Box, Alert } from '@mui/material'
import HistoryIcon   from '@mui/icons-material/History'
import PersonIcon    from '@mui/icons-material/Person'
import EventNoteIcon from '@mui/icons-material/EventNote'
import TodayIcon     from '@mui/icons-material/Today'
import StatCard       from '../../components/common/StatCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { getAuditLogs } from '../../services/auditorService'
 
const AuditorDashboard = () => {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAuditLogs()
        setLogs(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load audit data.')
        setLogs([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
 
  if (loading) return <LoadingSpinner message="Loading audit dashboard..." />
 
  const total = logs.length
 
  // ✅ username field (not performedBy)
  const uniqueUsers = [
    ...new Set(logs.map(l => l?.username).filter(Boolean))
  ].length
 
  // ✅ actionType field (not action)
  const uniqueActions = [
    ...new Set(logs.map(l => l?.actionType).filter(Boolean))
  ].length
 
  const today = new Date().toDateString()
  const todayLogs = logs.filter(l => {
    try { return new Date(l?.timestamp).toDateString() === today }
    catch { return false }
  }).length
 
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#1a1a2e" mb={3}>
        Audit Overview
      </Typography>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Logs"     value={total}         icon={<HistoryIcon />}   color="#1a1a2e" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Today's Logs"   value={todayLogs}     icon={<TodayIcon />}     color="#1e88e5" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Unique Users"   value={uniqueUsers}   icon={<PersonIcon />}    color="#43a047" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Unique Actions" value={uniqueActions} icon={<EventNoteIcon />} color="#fb8c00" />
        </Grid>
      </Grid>
    </Box>
  )
}
 
export default AuditorDashboard
 