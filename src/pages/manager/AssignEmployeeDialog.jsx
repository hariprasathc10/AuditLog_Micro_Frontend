import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Alert,
  CircularProgress, Box, Typography, Chip
} from '@mui/material'
import { getAvailableEmployees, assignEmployee } from '../../services/managerService'
import { getStatusLabel } from '../../utils/helpers'
import { ISSUE_STATUS_COLORS } from '../../utils/constants'
 
const AssignEmployeeDialog = ({ open, onClose, onAssigned, issue }) => {
  const [employees,   setEmployees]   = useState([])
  const [employeeId,  setEmployeeId]  = useState('')
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(false)
  const [error,       setError]       = useState(null)
 
  // Load employees when dialog opens
  useEffect(() => {
    if (open) {
      setFetching(true)
      getAvailableEmployees()
        .then(setEmployees)
        .catch(() => setError('Failed to load employees.'))
        .finally(() => setFetching(false))
 
      // Pre-select current employee if assigned
      setEmployeeId(issue?.employeeId || '')
    }
  }, [open, issue])
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!employeeId) return
    setError(null)
    setLoading(true)
    try {
      await assignEmployee(issue.id, employeeId)
      onAssigned()
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign employee.')
    } finally {
      setLoading(false)
    }
  }
 
  const handleClose = () => {
    setEmployeeId('')
    setError(null)
    onClose()
  }
 
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
        Assign Employee
      </DialogTitle>
 
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
 
          {/* Issue Info */}
          {issue && (
            <Box
              sx={{
                p: 1.5, borderRadius: 2,
                backgroundColor: '#f5f6fa',
                display: 'flex', flexDirection: 'column', gap: 0.5,
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="#1a1a2e">
                {issue.title}
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {issue.projectName}
                </Typography>
                <Chip
                  label={getStatusLabel(issue.status)}
                  color={ISSUE_STATUS_COLORS[issue.status] || 'default'}
                  size="small"
                />
              </Box>
            </Box>
          )}
 
          {/* Employee Select */}
          <TextField
            label="Select Employee"
            select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            fullWidth
            disabled={fetching}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            {fetching ? (
              <MenuItem disabled>Loading employees...</MenuItem>
            ) : employees.length === 0 ? (
              <MenuItem disabled>No employees available</MenuItem>
            ) : (
              employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.username}
                </MenuItem>
              ))
            )}
          </TextField>
        </DialogContent>
 
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit" variant="contained"
            disabled={loading || !employeeId}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}
          >
            {loading
              ? <CircularProgress size={20} color="inherit" />
              : 'Assign'
            }
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
 
export default AssignEmployeeDialog
 