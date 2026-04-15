import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Alert, CircularProgress, Box
} from '@mui/material'
import { createUser } from '../../services/adminService'
import { ROLES } from '../../utils/constants'
 
const CreateUserDialog = ({ open, onClose, onCreated }) => {
  const [form,    setForm]    = useState({ username: '', email: '', role: 'EMPLOYEE' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
 
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await createUser(form)
      onCreated()
      handleClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.')
    } finally {
      setLoading(false)
    }
  }
 
  const handleClose = () => {
    setForm({ username: '', email: '', role: 'EMPLOYEE' })
    setError(null)
    onClose()
  }
 
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1a1a2e' }}>
        Create New User
      </DialogTitle>
 
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
 
          {error && <Alert severity="error">{error}</Alert>}
 
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required fullWidth autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
 
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
 
          <TextField
            label="Role"
            name="role"
            select
            value={form.role}
            onChange={handleChange}
            required fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            {/* ✅ ROLES is array of {value, label} — map correctly */}
            {ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
 
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
              '&:hover': {
                background: 'linear-gradient(135deg, #0f3460, #1a1a2e)',
              },
            }}
          >
            {loading
              ? <CircularProgress size={20} color="inherit" />
              : 'Create User'
            }
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
 
export default CreateUserDialog
 