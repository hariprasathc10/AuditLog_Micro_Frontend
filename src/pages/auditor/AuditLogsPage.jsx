import { useEffect, useState } from 'react'
import {
Box, Typography, Table, TableBody, TableCell,
TableContainer, TableHead, TableRow, Paper, Chip,
Alert, TextField, InputAdornment, MenuItem,
Button, TablePagination, Tooltip, IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import NoData from '../../components/common/NoData'
import { getAuditLogs } from '../../services/auditorService'
import { formatDate } from '../../utils/helpers'
import { exportToExcel } from '../../utils/exportToExcel'

const ACTION_COLORS = {
LOGIN: 'success',
LOGOUT: 'default',
CREATE: 'primary',
UPDATE: 'warning',
DELETE: 'error',
ASSIGN: 'info',
STATUS_UPDATE: 'warning',
RESET_PASSWORD: 'secondary',
ACTIVATE: 'success',
DEACTIVATE: 'error',
}

const getActionColor = (action) => {
if (!action) return 'default'
for (const key of Object.keys(ACTION_COLORS)) {
if (action.toUpperCase().includes(key)) return ACTION_COLORS[key]
}
return 'default'
}

const ROLE_OPTIONS = ['ALL', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'AUDITOR']

// ✅ Fixed column definitions with widths + alignment
const COLUMNS = [
{ label: '#', width: 50, align: 'center' },
{ label: 'User', width: 160, align: 'left' },
{ label: 'Role', width: 110, align: 'center' },
{ label: 'Action', width: 140, align: 'center' },
{ label: 'Entity', width: 100, align: 'center' },
{ label: 'Reference', width: 140, align: 'left' },
{ label: 'Metadata', width: 200, align: 'left' },
{ label: 'Timestamp', width: 160, align: 'center' },
]

const AuditLogsPage = () => {
const [logs, setLogs] = useState([])
const [filtered, setFiltered] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

const [search, setSearch] = useState('')
const [actionFilter, setActionFilter] = useState('ALL')
const [roleFilter, setRoleFilter] = useState('ALL')
const [dateFrom, setDateFrom] = useState('')
const [dateTo, setDateTo] = useState('')

const [page, setPage] = useState(0)
const [rowsPerPage, setRowsPerPage] = useState(10)

const fetchLogs = async () => {
setLoading(true)
setError(null)
try {
const data = await getAuditLogs()
const sorted = [...data].sort(
(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
)
setLogs(sorted)
setFiltered(sorted)
} catch (err) {
console.error(err)
setError('Failed to load audit logs.')
} finally {
setLoading(false)
}
}

useEffect(() => { fetchLogs() }, [])

const uniqueActions = [
...new Set(logs.map((l) => l.actionType).filter(Boolean)),
]

useEffect(() => {
let result = [...logs]

if (actionFilter !== 'ALL')
result = result.filter((l) => l.actionType === actionFilter)

if (roleFilter !== 'ALL')
result = result.filter((l) => l.role === roleFilter)

if (dateFrom)
result = result.filter(
(l) => new Date(l.timestamp) >= new Date(dateFrom)
)

if (dateTo)
result = result.filter(
(l) => new Date(l.timestamp) <= new Date(dateTo + 'T23:59:59')
)

if (search) {
const q = search.toLowerCase()
result = result.filter(
(l) =>
l.username?.toLowerCase().includes(q) ||
l.actionType?.toLowerCase().includes(q) ||
l.entityType?.toLowerCase().includes(q) ||
l.entityReference?.toLowerCase().includes(q) ||
l.metadata?.toLowerCase().includes(q)
)
}

setFiltered(result)
setPage(0)
}, [search, actionFilter, roleFilter, dateFrom, dateTo, logs])

const resetFilters = () => {
setSearch('')
setActionFilter('ALL')
setRoleFilter('ALL')
setDateFrom('')
setDateTo('')
}

const handleExport = () => {
const exportData = filtered.map((log, i) => ({
'No.': i + 1,
'Username': log.username || '—',
'Role': log.role || '—',
'Action': log.actionType || '—',
'Entity Type': log.entityType || '—',
'Reference': log.entityReference || '—',
'Metadata': log.metadata || '—',
'Timestamp': log.timestamp
? new Date(log.timestamp).toLocaleString('en-IN')
: '—',
}))
exportToExcel(exportData, 'LATS_AuditLogs', 'Audit Logs')
}

const paginatedRows = filtered.slice(
page * rowsPerPage,
page * rowsPerPage + rowsPerPage
)

if (loading) return <LoadingSpinner message="Loading audit logs..." />

return (
<Box sx={{ p: { xs: 2, md: 3 } }}>

{/* ── Title Row ── */}
<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
<Typography variant="h5" fontWeight="bold" color="#1a1a2e">
Audit Logs
</Typography>
<br />
<Box display="flex" gap={1} alignItems="center">
<Tooltip title="Refresh">
<IconButton onClick={fetchLogs} color="primary" size="small">
<RefreshIcon />
</IconButton>
</Tooltip>
<Button
variant="contained"
startIcon={<FileDownloadIcon />}
onClick={handleExport}
disabled={filtered.length === 0}
size="small"
sx={{
background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
borderRadius: 2,
fontWeight: 'bold',
textTransform: 'none',
fontSize: 13,
'&:hover': {
background: 'linear-gradient(135deg, #0f3460, #1a1a2e)',
},
}}
>
Export Excel ({filtered.length})
</Button>
</Box>
<br />
</Box>

{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

{/* ── Filter Row 1 ── */}
<Box display="flex" gap={1.5} mb={1.5} flexWrap="wrap" alignItems="center">

<TextField
placeholder="Search by user, action, entity..."
size="small"
value={search}
onChange={(e) => setSearch(e.target.value)}
sx={{
flex: 2, minWidth: 200,
'& .MuiOutlinedInput-root': { borderRadius: 2 },
}}
slotProps={{
input: {
startAdornment: (
<InputAdornment position="start">
<SearchIcon color="action" fontSize="small" />
</InputAdornment>
),
},
}}
/>

<TextField
select size="small"
value={actionFilter}
onChange={(e) => setActionFilter(e.target.value)}
sx={{ minWidth: 155, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
>
<MenuItem value="ALL">All Actions</MenuItem>
{uniqueActions.map((action) => (
<MenuItem key={action} value={action}>{action}</MenuItem>
))}
</TextField>

<TextField
select size="small"
value={roleFilter}
onChange={(e) => setRoleFilter(e.target.value)}
sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
>
{ROLE_OPTIONS.map((r) => (
<MenuItem key={r} value={r}>
{r === 'ALL' ? 'All Roles' : r}
</MenuItem>
))}
</TextField>
</Box>
<br />

{/* ── Filter Row 2: Date Range + Reset ── */}
<Box display="flex" gap={1.5} mb={2} flexWrap="wrap" alignItems="center">
<TextField
type="date" size="small"
value={dateFrom}
onChange={(e) => setDateFrom(e.target.value)}
InputLabelProps={{ shrink: true }}
sx={{ minWidth: 155, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
/>
<TextField
type="date" size="small"
value={dateTo}
onChange={(e) => setDateTo(e.target.value)}
InputLabelProps={{ shrink: true }}
sx={{ minWidth: 155, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
/>
<Button
variant="outlined"
startIcon={<FilterAltOffIcon />}
onClick={resetFilters}
size="small"
sx={{ borderRadius: 2, textTransform: 'none' }}
>   
Reset Filters
</Button>
</Box>
<br />

{/* ── Count ── */}
<Typography variant="body2" color="text.secondary" mb={1.5}>
Showing <strong>{filtered.length}</strong> of <strong>{logs.length}</strong> logs
</Typography>

{/* ── Table ── */}
{filtered.length === 0
? <NoData message="No audit logs found." />
: (
<Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
<TableContainer>
<Table
size="small"
sx={{ tableLayout: 'fixed', minWidth: 900 }} // ✅ fixed layout = proper alignment
>

{/* ✅ Define column widths using <colgroup> */}
<colgroup>
{COLUMNS.map((col) => (
<col key={col.label} style={{ width: col.width }} />
))}
</colgroup>

<TableHead sx={{ backgroundColor: '#1a1a2e' }}>
<TableRow>
{COLUMNS.map((col) => (
<TableCell
key={col.label}
align={col.align}
sx={{
color: '#fff',
fontWeight: 'bold',
fontSize: 13,
py: 1.5,
whiteSpace: 'nowrap',
}}
>
{col.label}
</TableCell>
))}
</TableRow>
</TableHead>

<TableBody>
{paginatedRows.map((log, index) => (
<TableRow
key={log.id ?? index}
hover
sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}
>

{/* # */}
<TableCell align="center" sx={{ color: 'text.secondary', fontSize: 13 }}>
{page * rowsPerPage + index + 1}
</TableCell>

{/* User */}
<TableCell align="left">
<Box display="flex" alignItems="center" gap={1}>
<Box sx={{
width: 28, height: 28,
borderRadius: '50%',
backgroundColor: '#1a1a2e',
color: '#fff',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontSize: 11,
fontWeight: 'bold',
flexShrink: 0,
}}>
{log.username?.charAt(0).toUpperCase() ?? '?'}
</Box>
<Typography
variant="body2"
fontWeight="bold"
noWrap // ✅ prevent overflow
title={log.username}
>
{log.username ?? '—'}
</Typography>
</Box>
</TableCell>

{/* Role */}
<TableCell align="center">
<Chip
label={log.role ?? '—'}
size="small"
variant="outlined"
sx={{ fontSize: 11, minWidth: 70 }}
/>
</TableCell>

{/* Action */}
<TableCell align="center">
<Chip
label={log.actionType ?? '—'}
color={getActionColor(log.actionType)}
size="small"
sx={{ fontWeight: 'bold', fontSize: 11, minWidth: 80 }}
/>
</TableCell>

{/* Entity */}
<TableCell align="center">
<Typography variant="body2" color="text.secondary" noWrap>
{log.entityType ?? '—'}
</Typography>
</TableCell>

{/* Reference */}
<TableCell align="left">
<Typography
variant="body2"
color="text.secondary"
noWrap
title={log.entityReference} // ✅ tooltip on hover for full text
sx={{ maxWidth: 130 }}
>
{log.entityReference ?? '—'}
</Typography>
</TableCell>

{/* Metadata */}
<TableCell align="left">
<Typography
variant="body2"
color="text.secondary"
noWrap
title={log.metadata} // ✅ tooltip on hover for full text
sx={{ maxWidth: 190 }}
>
{log.metadata ?? '—'}
</Typography>
</TableCell>

{/* Timestamp */}
<TableCell align="center">
<Typography variant="body2" color="text.secondary" noWrap>
{log.timestamp ? formatDate(log.timestamp) : '—'}
</Typography>
</TableCell>

</TableRow>
))}
</TableBody>
</Table>
</TableContainer>

<TablePagination
component="div"
count={filtered.length}
page={page}
onPageChange={(_, newPage) => setPage(newPage)}
rowsPerPage={rowsPerPage}
onRowsPerPageChange={(e) => {
setRowsPerPage(parseInt(e.target.value, 10))
setPage(0)
}}
rowsPerPageOptions={[5, 10, 25, 50, 100]}
/>
</Paper>
)
}
</Box>
)
}

export default AuditLogsPage