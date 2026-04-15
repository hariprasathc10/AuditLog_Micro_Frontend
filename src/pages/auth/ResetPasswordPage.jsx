import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { resetPassword } from '../../services/authService'
import { getUser } from '../../utils/helpers'

const ResetPasswordPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const savedUser = getUser()
  const resolvedUser = user || savedUser

  const [manualUsername, setManualUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const username = resolvedUser?.username || manualUsername.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username) {
      setError('Username is required.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await resetPassword(username, newPassword)
      setSuccess(true)

      setTimeout(() => {
        logout?.()
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to reset password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1b1446 0%, #2a0f5e 50%, #4b1248 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={18}
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          overflow: 'hidden',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #ffffff, #ffffff)',
            py: 3.5,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#fff">
            Reset Password
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 0, 0, 0.65)' }}
          >
            {username
              ? `Resetting for: ${username}`
              : 'LATS — Log & Audit Tracking System'}
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            px: 4,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              Password reset successful! Redirecting to login…
            </Alert>
          )}

          {/* Username (only if session missing) */}
          {!resolvedUser?.username && (
            <TextField
              label="Username"
              fullWidth
              required
              value={manualUsername}
              onChange={(e) => setManualUsername(e.target.value)}
              InputLabelProps={{ style: { color: '#cfc3ff' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#b6aaff' }} />
                  </InputAdornment>
                ),
                sx: { color: '#fff' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            />
          )}

          {/* New Password */}
          <TextField
            label="New Password"
            fullWidth
            required
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#cfc3ff' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#b6aaff' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNew(!showNew)}
                    sx={{ color: '#cfc3ff' }}
                  >
                    {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { color: '#fff' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            fullWidth
            required
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#cfc3ff' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#b6aaff' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm(!showConfirm)}
                    sx={{ color: '#cfc3ff' }}
                  >
                    {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { color: '#fff' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
          />

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            size="large"
            disabled={loading || success}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 15,
              color: '#fff',
              background: 'linear-gradient(135deg, #d72665, #9b1d4a)',
              boxShadow: '0 8px 25px rgba(215,38,101,0.45)',
              '&:hover': {
                background: 'linear-gradient(135deg, #9b1d4a, #d72665)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </Button>

          {/* Back */}
          <Button
            onClick={() => navigate('/login')}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'rgba(255,255,255,0.65)',
              borderRadius: 2,
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ResetPasswordPage