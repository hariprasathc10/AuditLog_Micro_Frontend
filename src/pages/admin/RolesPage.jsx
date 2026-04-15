import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Alert
} from '@mui/material'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import NoData         from '../../components/common/NoData'
import { getAllUsers } from '../../services/adminService'
import { getRoleLabel } from '../../utils/helpers'
 
const ROLE_COLORS = {
  ADMIN:    'error',
  MANAGER:  'primary',
  EMPLOYEE: 'success',
  AUDITOR:  'warning',
}
 
const RolesPage = () => {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
 
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data)
      } catch {
        setError('Failed to load role data.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])
 
  if (loading) return <LoadingSpinner message="Loading roles..." />
 
  // ---------- Group by role ----------
  const grouped = users.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = []
    acc[user.role].push(user)
    return acc
  }, {})
 
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#1a1a2e" mb={3}>
        Roles Overview
      </Typography>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      {users.length === 0 ? (
        <NoData message="No role data available." />
      ) : (
        Object.entries(grouped).map(([role, members]) => (
          <Box key={role} mb={4}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <Chip
                label={getRoleLabel(role)}
                color={ROLE_COLORS[role] || 'default'}
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="body2" color="text.secondary">
                {members.length} user{members.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
 
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f6fa' }}>
                  <TableRow>
                    {['#', 'Username', 'Email', 'Status'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((user, i) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.active ? 'Active' : 'Inactive'}
                          color={user.active ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      )}
    </Box>
  )
}
 
export default RolesPage
 