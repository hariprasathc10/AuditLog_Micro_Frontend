import { useEffect, useState } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  Button, Alert, TextField, InputAdornment, MenuItem
} from '@mui/material'
import EditIcon   from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import LoadingSpinner    from '../../components/common/LoadingSpinner'
import NoData            from '../../components/common/NoData'
import IssueStatusDialog from './IssueStatusDialog'
import { getMyIssues }   from '../../services/employeeService'
import { formatDate, truncate, getStatusLabel } from '../../utils/helpers'
import { ISSUE_STATUS, ISSUE_STATUS_COLORS }    from '../../utils/constants'
 
const MyIssuesPage = () => {
  const [issues,        setIssues]        = useState([])
  const [filtered,      setFiltered]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('ALL')
  const [dialogOpen,    setDialogOpen]    = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
 
  const fetchIssues = async () => {
    setLoading(true)
    try {
      const data = await getMyIssues()
      setIssues(data)
      setFiltered(data)
    } catch {
      setError('Failed to load issues.')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => { fetchIssues() }, [])
 
  // ---------- Filter ----------
  useEffect(() => {
    let result = [...issues]
    if (statusFilter !== 'ALL') {
      result = result.filter(i => i.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.projectName?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, issues])
 
  const handleUpdateStatus = (issue) => {
    setSelectedIssue(issue)
    setDialogOpen(true)
  }
 
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedIssue(null)
  }
 
  if (loading) return <LoadingSpinner message="Loading your issues..." />
 
  return (
    <Box>
      {/* ---------- Header ---------- */}
      <Typography variant="h5" fontWeight="bold" color="#1a1a2e" mb={3}>
        My Issues
      </Typography>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      {/* ---------- Filters ---------- */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          placeholder="Search by title or project..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          {Object.values(ISSUE_STATUS).map(s => (
            <MenuItem key={s} value={s}>{getStatusLabel(s)}</MenuItem>
          ))}
        </TextField>
      </Box>
 
      {/* ---------- Table ---------- */}
      {filtered.length === 0 ? <NoData message="No issues assigned to you." /> : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
              <TableRow>
                {['#', 'Title', 'Project', 'Status', 'Progress', 'Current Task', 'Updated', 'Action'].map(h => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((issue, index) => (
                <TableRow key={issue.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {truncate(issue.title, 28)}
                  </TableCell>
                  <TableCell>{issue.projectName || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(issue.status)}
                      color={ISSUE_STATUS_COLORS[issue.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{truncate(issue.progressDetails, 25) || '—'}</TableCell>
                  <TableCell>{truncate(issue.currentTask, 25) || '—'}</TableCell>
                  <TableCell>{formatDate(issue.updatedAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleUpdateStatus(issue)}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
 
      {/* ---------- Status Dialog ---------- */}
      <IssueStatusDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onUpdated={fetchIssues}
        issue={selectedIssue}
      />
    </Box>
  )
}
 
export default MyIssuesPage