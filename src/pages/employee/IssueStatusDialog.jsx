import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Alert, CircularProgress,
  Box, Typography, Chip
} from '@mui/material'
import { updateIssueStatus }  from '../../services/employeeService'
import { ISSUE_STATUS, ISSUE_STATUS_COLORS } from '../../utils/constants'
import { getStatusLabel }     from '../../utils/helpers'
 
const IssueStatusDialog = ({ open, onClose, onUpdated, issue }) => {
  const [form,    setForm]    = useState({
    status: '', progressDetails: '', currentTask: ''
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
 
  // ---------- Populate on open ----------
  useEffect(() => {
    if (issue) {
      setForm({
        status:          issue.status          || 'OPEN',
        progressDetails: issue.progressDetails || '',
        currentTask:     issue.currentTask     || '',
      })
    }
  }, [issue])
 
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await updateIssueStatus(issue.id, form)
      onUpdated()
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setLoading(false)
    }
  }
 
  const handleClose = () => {
    setForm({ status: '', progressDetails: '', currentTask: '' })
    setError(null)
    onClose()
  }
 
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
        Update Issue Status
      </DialogTitle>
 
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
 
          {/* ---------- Issue Info Preview ---------- */}
          {issue && (
            <Box
              sx={{
                p: 2, borderRadius: 2,
                backgroundColor: '#f5f6fa',
                display: 'flex', flexDirection: 'column', gap: 0.8,
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="#1a1a2e">
                {issue.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Project: {issue.projectName || '—'}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  Current Status:
                </Typography>
                <Chip
                  label={getStatusLabel(issue.status)}
                  color={ISSUE_STATUS_COLORS[issue.status] || 'default'}
                  size="small"
                />
              </Box>
            </Box>
          )}
 
          {/* ---------- New Status ---------- */}
          <TextField
            label="New Status"
            name="status"
            select
            value={form.status}
            onChange={handleChange}
            required
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            {Object.values(ISSUE_STATUS).map(s => (
              <MenuItem key={s} value={s}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={getStatusLabel(s)}
                    color={ISSUE_STATUS_COLORS[s] || 'default'}
                    size="small"
                  />
                </Box>
              </MenuItem>
            ))}
          </TextField>
 
          {/* ---------- Progress Details ---------- */}
          <TextField
            label="Progress Details"
            name="progressDetails"
            value={form.progressDetails}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Describe what has been done so far..."
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
 
          {/* ---------- Current Task ---------- */}
          <TextField
            label="Current Task"
            name="currentTask"
            value={form.currentTask}
            onChange={handleChange}
            fullWidth
            placeholder="What are you currently working on?"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
 
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            }}
          >
            {loading
              ? <CircularProgress size={20} color="inherit" />
              : 'Update Status'
            }
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
 
export default IssueStatusDialog
 