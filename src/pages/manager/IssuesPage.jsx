import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Tooltip, Alert, TextField, InputAdornment, MenuItem
} from '@mui/material'
import AddIcon      from '@mui/icons-material/Add'
import EditIcon     from '@mui/icons-material/Edit'
import DeleteIcon   from '@mui/icons-material/Delete'
import SearchIcon   from '@mui/icons-material/Search'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmDialog  from '../../components/common/ConfirmDialog'
import NoData         from '../../components/common/NoData'
import IssueDialog    from './IssueDialog'
import { getAllIssues, deleteIssue } from '../../services/managerService'
import { formatDate, truncate }      from '../../utils/helpers'
import { ISSUE_STATUS, ISSUE_STATUS_COLORS } from '../../utils/constants'
 
// ✅ Local label helper — no external dependency needed
const getStatusLabel = (status) => {
  const found = ISSUE_STATUS.find((s) => s.value === status)
  return found ? found.label : (status || '—')
}
 
const IssuesPage = () => {
  const [issues,       setIssues]       = useState([])
  const [filtered,     setFiltered]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dialogOpen,   setDialogOpen]   = useState(false)
  const [confirmOpen,  setConfirmOpen]  = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
 
  const fetchIssues = async () => {
    setLoading(true)
    try {
      const data = await getAllIssues()
      setIssues(data)
      setFiltered(data)
    } catch {
      setError('Failed to load issues.')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => { fetchIssues() }, [])
 
  // ── Filter ──────────────────────────────────────────
  useEffect(() => {
    let result = [...issues]
    if (statusFilter !== 'ALL')
      result = result.filter((i) => i.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((i) =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, statusFilter, issues])
 
  const handleEdit  = (issue) => { setSelectedIssue(issue); setDialogOpen(true) }
  const handleDelete = (issue) => { setSelectedIssue(issue); setConfirmOpen(true) }
 
  const handleConfirmDelete = async () => {
    setConfirmOpen(false)
    try {
      await deleteIssue(selectedIssue.id)
      fetchIssues()
    } catch {
      setError('Failed to delete issue.')
    }
  }
 
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedIssue(null)
  }
 
  if (loading) return <LoadingSpinner message="Loading issues..." />
 
  return (
    <Box>
 
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
          Issues
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setSelectedIssue(null); setDialogOpen(true) }}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
            '&:hover': { background: 'linear-gradient(135deg, #0f3460, #1a1a2e)' },
          }}
        >
          New Issue
        </Button>
      </Box>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          placeholder="Search issues..."
          size="small" fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          {/* ✅ ISSUE_STATUS is [{value, label}] — map correctly */}
          {ISSUE_STATUS.map((s) => (
            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
          ))}
        </TextField>
      </Box>
 
      {/* Table */}
      {filtered.length === 0
        ? <NoData message="No issues found." />
        : (
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
                <TableRow>
                  {['#', 'Title', 'Project', 'Assigned To', 'Status',
                    'Current Task', 'Created', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((issue, index) => (
                  <TableRow key={issue.id} hover
                    sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}
                  >
                    <TableCell>{index + 1}</TableCell>
 
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {truncate(issue.title, 30)}
                    </TableCell>
 
                    {/* ✅ IssueResponse has projectName */}
                    <TableCell>{issue.projectName || '—'}</TableCell>
 
                    {/* ✅ IssueResponse has employeeUsername */}
                    <TableCell>{issue.employeeUsername || 'Unassigned'}</TableCell>
 
                    <TableCell>
                      <Chip
                        label={getStatusLabel(issue.status)}
                        color={ISSUE_STATUS_COLORS[issue.status] || 'default'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
 
                    <TableCell>{truncate(issue.currentTask, 25) || '—'}</TableCell>
 
                    {/* ✅ IssueResponse uses createdAt from entity */}
                    <TableCell>{formatDate(issue.createdAt)}</TableCell>
 
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary"
                          onClick={() => handleEdit(issue)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error"
                          onClick={() => handleDelete(issue)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      }
 
      {/* ✅ onSuccess — matches IssueDialog prop */}
      <IssueDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSuccess={fetchIssues}       // ✅ was onSaved — now fixed
        issue={selectedIssue}
      />
 
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Issue"
        message={`Delete "${selectedIssue?.title}"? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  )
}
 
export default IssuesPage
 