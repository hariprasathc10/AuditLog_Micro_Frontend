import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Tooltip, Alert, TextField, InputAdornment
} from '@mui/material'
import AddIcon         from '@mui/icons-material/Add'
import DeleteIcon      from '@mui/icons-material/Delete'
import BlockIcon       from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon      from '@mui/icons-material/Search'
import LoadingSpinner  from '../../components/common/LoadingSpinner'
import ConfirmDialog   from '../../components/common/ConfirmDialog'
import NoData          from '../../components/common/NoData'
import CreateUserDialog from './CreateUserDialog'
import {
  getAllUsers, updateUserStatus, deleteUser
} from '../../services/adminService'
import { getRoleLabel, formatDate } from '../../utils/helpers'
 
const ROLE_COLORS = {
  ADMIN:    'error',
  MANAGER:  'primary',
  EMPLOYEE: 'success',
  AUDITOR:  'warning',
}
 
const UsersPage = () => {
  const [users,         setUsers]         = useState([])
  const [filtered,      setFiltered]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [search,        setSearch]        = useState('')
  const [createOpen,    setCreateOpen]    = useState(false)
  const [confirmOpen,   setConfirmOpen]   = useState(false)
  const [selectedUser,  setSelectedUser]  = useState(null)
  const [confirmAction, setConfirmAction] = useState('')
 
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
      setFiltered(data)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => { fetchUsers() }, [])
 
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      users.filter(u =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      )
    )
  }, [search, users])
 
  const handleToggleStatus = (user) => {
    setSelectedUser(user)
    setConfirmAction('status')
    setConfirmOpen(true)
  }
 
  const handleDelete = (user) => {
    setSelectedUser(user)
    setConfirmAction('delete')
    setConfirmOpen(true)
  }
 
  const handleConfirm = async () => {
    setConfirmOpen(false)
    try {
      if (confirmAction === 'status') {
        await updateUserStatus(selectedUser.id, !selectedUser.active)
      } else if (confirmAction === 'delete') {
        await deleteUser(selectedUser.id)
      }
      fetchUsers()
    } catch {
      setError('Action failed. Please try again.')
    }
  }
 
  if (loading) return <LoadingSpinner message="Loading users..." />
 
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
          All Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}
        >
          Create User
        </Button>
      </Box>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      <TextField
        placeholder="Search by username, email or role..."
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
          ),
        }}
      />
 
      {filtered.length === 0 ? <NoData message="No users found." /> : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
              <TableRow>
                {['#', 'Username', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user, index) => (
                <TableRow key={user.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={getRoleLabel(user.role)} color={ROLE_COLORS[user.role] || 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.active ? 'Active' : 'Inactive'}
                      color={user.active ? 'success' : 'error'}
                      size="small" variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Tooltip title={user.active ? 'Deactivate' : 'Activate'}>
                      <IconButton size="small" color={user.active ? 'error' : 'success'}
                        onClick={() => handleToggleStatus(user)}>
                        {user.active ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
 
      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchUsers}
      />
 
      <ConfirmDialog
        open={confirmOpen}
        title={confirmAction === 'delete' ? 'Delete User' : 'Toggle Status'}
        message={
          confirmAction === 'delete'
            ? `Delete "${selectedUser?.username}"? This cannot be undone.`
            : `${selectedUser?.active ? 'Deactivate' : 'Activate'} "${selectedUser?.username}"?`
        }
        confirmText={confirmAction === 'delete' ? 'Delete' : 'Confirm'}
        confirmColor={confirmAction === 'delete' ? 'error' : 'primary'}
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  )
}
 
export default UsersPage