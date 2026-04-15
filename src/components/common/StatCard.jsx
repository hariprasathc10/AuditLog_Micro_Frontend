import { Box, Paper, Typography } from '@mui/material'
 
const StatCard = ({ title, value, icon, color }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderLeft: `5px solid ${color || '#1a1a2e'}`,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-3px)' },
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          backgroundColor: `${color}22` || '#1a1a2e22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color || '#1a1a2e',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
          {value ?? 0}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  )
}
 
export default StatCard