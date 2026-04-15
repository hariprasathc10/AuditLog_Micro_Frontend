import { Box, CircularProgress, Typography } from '@mui/material'
 
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{                        
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress
        size={48}
        sx={{ color: '#1a1a2e' }}
      />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}
 
export default LoadingSpinner
 