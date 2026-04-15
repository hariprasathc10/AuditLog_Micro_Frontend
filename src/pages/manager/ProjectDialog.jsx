import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, CircularProgress, Box
} from '@mui/material'
import { createProject, updateProject } from '../../services/managerService'
 
const ProjectDialog = ({ open, onClose, onSaved, project }) => {
  const [form,    setForm]    = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
 
  const isEdit = Boolean(project)
 
  // Populate form when editing
  useEffect(() => {
    if (project) {
      setForm({ name: project.name, description: project.description || '' })
    } else {
      setForm({ name: '', description: '' })
    }
  }, [project])
 
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isEdit) {
        await updateProject(project.id, form)
      } else {
        await createProject(form)
      }
      onSaved()
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.')
    } finally {
      setLoading(false)
    }
  }
 
  const handleClose = () => {
    setForm({ name: '', description: '' })
    setError(null)
    onClose()
  }
 
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
        {isEdit ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
 
          <TextField
            label="Project Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
 
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
 
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}
          >
            {loading
              ? <CircularProgress size={20} color="inherit" />
              : isEdit ? 'Update' : 'Create'
            }
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
 
export default ProjectDialog