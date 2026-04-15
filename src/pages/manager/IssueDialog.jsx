import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem,
  CircularProgress, Alert
} from '@mui/material'
import { ISSUE_STATUSES } from '../../utils/constants'
import {
  createIssue,
  updateIssue,
  getAvailableEmployees,
  getManagerProjects,
} from '../../services/managerService'
 
const defaultForm = {
  title:           '',
  description:     '',
  projectId:       '',
  employeeId:      '',
  status:          'OPEN',
  progressDetails: '',
  currentTask:     '',
}
 
const IssueDialog = ({ open, onClose, onSuccess, issue = null }) => {
  const [form,      setForm]      = useState(defaultForm)
  const [projects,  setProjects]  = useState([])
  const [employees, setEmployees] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
 
  const isEdit = !!issue
 
  // ── Prefill when editing ─────────────────────────────
  useEffect(() => {
    if (issue) {
      setForm({
        title:           issue.title           || '',
        description:     issue.description     || '',
        projectId:       issue.projectId       || '',
        employeeId:      issue.employeeId      || '',
        // ✅ Backend returns IN_PROGRESS — use directly
        status:          issue.status          || 'OPEN',
        progressDetails: issue.progressDetails || '',
        currentTask:     issue.currentTask     || '',
      })
    } else {
      setForm(defaultForm)
    }
    setError(null)
  }, [issue, open])
 
  // ── Load dropdowns ───────────────────────────────────
  useEffect(() => {
    if (!open) return
    const fetchData = async () => {
      try {
        const [proj, emp] = await Promise.all([
          getManagerProjects(),
          getAvailableEmployees(),
        ])
        setProjects(Array.isArray(proj) ? proj : [])
        setEmployees(Array.isArray(emp) ? emp : [])
      } catch (err) {
        console.error('Failed to load dialog data:', err)
      }
    }
    fetchData()
  }, [open])
 
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
 
  const handleSubmit = async () => {
    setError(null)
 
    if (!form.title.trim()) {
      setError('Issue title is required.')
      return
    }
    if (!form.projectId) {
      setError('Please select a project.')
      return
    }
 
    setLoading(true)
    try {
      // ✅ status sent as-is — matches backend enum (OPEN, IN_PROGRESS, etc.)
      const payload = {
        title:           form.title.trim(),
        description:     form.description.trim(),
        projectId:       Number(form.projectId),
        employeeId:      form.employeeId ? Number(form.employeeId) : null,
        status:          form.status,
        progressDetails: form.progressDetails.trim(),
        currentTask:     form.currentTask.trim(),
      }
 
      console.log('📤 Submitting payload:', payload)
 
      if (isEdit) {
        await updateIssue(issue.id, payload)
      } else {
        await createIssue(payload)
      }
 
      onSuccess?.()   // ✅ triggers fetchIssues in IssuesPage
      onClose()
    } catch (err) {
      console.error('❌ Submit error:', err.response?.data)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Failed to save issue.'
      )
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
        color: '#fff',
      }}>
        {isEdit ? 'Edit Issue' : 'Create Issue'}
      </DialogTitle>
 
      <DialogContent sx={{
        pt: 3, mt: 1,
        display: 'flex', flexDirection: 'column', gap: 2.5,
      }}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        )}
 
        {/* Title */}
        <TextField
          label="Issue Title *"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
 
        {/* Description */}
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth multiline rows={3} size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
 
        {/* Project */}
        <TextField
          select
          label="Project *"
          name="projectId"
          value={form.projectId}
          onChange={handleChange}
          fullWidth size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          <MenuItem value="">Select Project</MenuItem>
          {projects.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </TextField>
 
        {/* Employee */}
        <TextField
          select
          label="Assign Employee"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          fullWidth size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {employees.map((e) => (
            // ✅ IssueResponse has employeeUsername — use that
            <MenuItem key={e.id} value={e.id}>
              {e.username || e.employeeUsername || e.name}
            </MenuItem>
          ))}
        </TextField>
 
        {/* Status */}
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          fullWidth size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          {/* ✅ ISSUE_STATUSES has {value, label} — use correctly */}
          {ISSUE_STATUSES.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </TextField>
 
        {/* Progress Details */}
        <TextField
          label="Progress Details"
          name="progressDetails"
          value={form.progressDetails}
          onChange={handleChange}
          fullWidth multiline rows={2} size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
 
        {/* Current Task */}
        <TextField
          label="Current Task"
          name="currentTask"
          value={form.currentTask}
          onChange={handleChange}
          fullWidth size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </DialogContent>
 
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            '&:hover': { background: 'linear-gradient(135deg, #0f3460, #1a1a2e)' },
          }}
        >
          {loading
            ? <CircularProgress size={20} color="inherit" />
            : isEdit ? 'Update' : 'Create'
          }
        </Button>
      </DialogActions>
    </Dialog>
  )
}
 
export default IssueDialog
 