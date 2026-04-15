import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Alert, TextField, InputAdornment
} from '@mui/material'
import AddIcon    from '@mui/icons-material/Add'
import EditIcon   from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmDialog  from '../../components/common/ConfirmDialog'
import NoData         from '../../components/common/NoData'
import ProjectDialog  from './ProjectDialog'
import {
  getMyProjects, deleteProject
} from '../../services/managerService'
import { formatDate, truncate } from '../../utils/helpers'
 
const ProjectsPage = () => {
  const [projects,       setProjects]       = useState([])
  const [filtered,       setFiltered]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState(null)
  const [search,         setSearch]         = useState('')
  const [dialogOpen,     setDialogOpen]     = useState(false)
  const [confirmOpen,    setConfirmOpen]    = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
 
  const fetchProjects = async () => {
    setLoading(true)
    try {
      const data = await getMyProjects()
      setProjects(data)
      setFiltered(data)
    } catch {
      setError('Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }
 
  useEffect(() => { fetchProjects() }, [])
 
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      projects.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    )
  }, [search, projects])
 
  const handleEdit = (project) => {
    setSelectedProject(project)
    setDialogOpen(true)
  }
 
  const handleDelete = (project) => {
    setSelectedProject(project)
    setConfirmOpen(true)
  }
 
  const handleConfirmDelete = async () => {
    setConfirmOpen(false)
    try {
      await deleteProject(selectedProject.id)
      fetchProjects()
    } catch {
      setError('Failed to delete project.')
    }
  }
 
  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedProject(null)
  }
 
  if (loading) return <LoadingSpinner message="Loading projects..." />
 
  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#1a1a2e">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}
        >
          New Project
        </Button>
      </Box>
 
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
 
      {/* Search */}
      <TextField
        placeholder="Search projects..."
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
 
      {/* Table */}
      {filtered.length === 0 ? <NoData message="No projects found." /> : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1a1a2e' }}>
              <TableRow>
                {['#', 'Name', 'Description', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ color: '#fff', fontWeight: 'bold' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((project, index) => (
                <TableRow key={project.id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{project.name}</TableCell>
                  <TableCell>{truncate(project.description)}</TableCell>
                  <TableCell>{formatDate(project.createdAt)}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(project)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(project)}>
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
 
      {/* Project Dialog */}
      <ProjectDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSaved={fetchProjects}
        project={selectedProject}
      />
 
      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Project"
        message={`Delete "${selectedProject?.name}"? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Box>
  )
}
 
export default ProjectsPage
 