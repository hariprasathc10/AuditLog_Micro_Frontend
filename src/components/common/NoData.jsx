import { Box, Typography } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
 
const NoData = ({ message = 'No data found.' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={1}
      color="text.secondary"
    >
      <InboxIcon sx={{ fontSize: 56, opacity: 0.4 }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}
 
export default NoData