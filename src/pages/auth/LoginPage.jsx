import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const { login, loading, error } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    await login(username.trim(), password)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b1446 0%, #2a0f5e 50%, #4b1248 100%)',
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
          backdropFilter: 'blur(10px)',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #dadada, #ffffff)',
            py: 4,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #d72665, #a81e52)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              fontSize: 30,
              fontWeight: 700,
              color: '#000000',
              boxShadow: '0 10px 30px rgba(215,38,101,0.45)',
            }}
          >
            L
          </Box>

          <Typography variant="h5" fontWeight="600" color="#fff">
            LATS
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(0, 0, 0, 0.65)' }}
          >
            Log & Audit Tracking System
          </Typography>
        </Box>

        {/* Login Form */}
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
          <Typography
            variant="h6"
            fontWeight={600}
            textAlign="center"
            color="#ffffff"
          >
            Welcome Back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            InputLabelProps={{ style: { color: '#cfc3ff' } }}
            slotProps={{
              input: {
                startAdornment: (
                  <AccountCircleIcon sx={{ color: '#b6aaff', mr: 1 }} />
                ),
                style: { color: '#fff' },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.25)',
              },
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputLabelProps={{ style: { color: '#cfc3ff' } }}
            slotProps={{
              input: {
                startAdornment: (
                  <LockIcon sx={{ color: '#b6aaff', mr: 1 }} />
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#cfc3ff' }}
                  >
                    {showPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                ),
                style: { color: '#fff' },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.25)',
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 15,
              color: '#fff',
              background:
                'linear-gradient(135deg, #d72665, #9b1d4a)',
              boxShadow: '0 8px 25px rgba(215,38,101,0.4)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #9b1d4a, #d72665)',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}
          >
            Contact your administrator if you forgot your credentials.
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default LoginPage