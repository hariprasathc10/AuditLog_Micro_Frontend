import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import AuditLogsPage from '../../pages/auditor/AuditLogsPage'
import * as auditorService from '../../services/auditorService'


// ── Mock data ─────────────────────────────────────────
const MOCK_LOGS = [
  {
    id: 1, username: 'admin', role: 'ADMIN',
    actionType: 'LOGIN', entityType: 'USER',
    entityReference: 'admin', metadata: 'Logged in',
    timestamp: '2026-04-13T10:00:00',
  },
  {
    id: 2, username: 'emp1', role: 'EMPLOYEE',
    actionType: 'CREATE', entityType: 'ISSUE',
    entityReference: 'Issue-5', metadata: 'Created issue',
    timestamp: '2026-04-12T09:00:00',
  },
  {
    id: 3, username: 'manager1', role: 'MANAGER',
    actionType: 'ASSIGN', entityType: 'ISSUE',
    entityReference: 'Issue-5', metadata: 'Assigned to emp1',
    timestamp: '2026-04-11T08:00:00',
  },
]


vi.mock('../../services/auditorService', () => ({
  getAuditLogs: vi.fn(),
}))


vi.mock('../../utils/exportToExcel', () => ({
  exportToExcel: vi.fn(),
}))


const renderPage = () =>
  render(
    <MemoryRouter>
      <AuditLogsPage />
    </MemoryRouter>
  )


describe('AuditLogsPage', () => {


  beforeEach(() => {
    auditorService.getAuditLogs.mockResolvedValue(MOCK_LOGS)
  })


  afterEach(() => vi.clearAllMocks())


  // ── Render ───────────────────────────────────────────
  it('renders Audit Logs heading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Audit Logs')).toBeInTheDocument()
    })
  })


  it('renders all log rows after fetch', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getByText('emp1')).toBeInTheDocument()
      expect(screen.getByText('manager1')).toBeInTheDocument()
    })
  })


  it('shows correct log count', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/showing 3 of 3 logs/i)).toBeInTheDocument()
    })
  })


  // ── Search filter ─────────────────────────────────────
  it('filters logs by search input', async () => {
    renderPage()
    await waitFor(() => screen.getByText('admin'))
    fireEvent.change(screen.getByPlaceholderText(/search by user/i), {
      target: { value: 'emp1' },
    })
    await waitFor(() => {
      expect(screen.getByText('emp1')).toBeInTheDocument()
      expect(screen.queryByText('manager1')).not.toBeInTheDocument()
    })
  })


  // ── Action filter ─────────────────────────────────────
  it('filters logs by action type', async () => {
    renderPage()
    await waitFor(() => screen.getByText('admin'))


    fireEvent.mouseDown(screen.getByDisplayValue('All Actions'))
    fireEvent.click(screen.getByText('ASSIGN'))


    await waitFor(() => {
      expect(screen.getByText('manager1')).toBeInTheDocument()
      expect(screen.queryByText('emp1')).not.toBeInTheDocument()
    })
  })


  // ── Role filter ───────────────────────────────────────
  it('filters logs by role', async () => {
    renderPage()
    await waitFor(() => screen.getByText('admin'))


    fireEvent.mouseDown(screen.getByDisplayValue('All Roles'))
    fireEvent.click(screen.getByText('ADMIN'))


    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.queryByText('emp1')).not.toBeInTheDocument()
    })
  })


  // ── Reset filters ─────────────────────────────────────
  it('resets filters and shows all logs', async () => {
    renderPage()
    await waitFor(() => screen.getByText('admin'))


    fireEvent.change(screen.getByPlaceholderText(/search by user/i), {
      target: { value: 'emp1' },
    })
    await waitFor(() => expect(screen.queryByText('admin')).not.toBeInTheDocument())


    fireEvent.click(screen.getByRole('button', { name: /reset filters/i }))
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
      expect(screen.getByText('emp1')).toBeInTheDocument()
    })
  })


  // ── Export Excel ──────────────────────────────────────
  it('calls exportToExcel when Export button clicked', async () => {
    const { exportToExcel } = await import('../../utils/exportToExcel')
    renderPage()
    await waitFor(() => screen.getByText('admin'))
    fireEvent.click(screen.getByRole('button', { name: /export excel/i }))
    expect(exportToExcel).toHaveBeenCalled()
  })


  // ── Error state ───────────────────────────────────────
  it('shows error alert when fetch fails', async () => {
    auditorService.getAuditLogs.mockRejectedValueOnce(new Error('Network Error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/failed to load audit logs/i)).toBeInTheDocument()
    })
  })


  // ── Empty state ───────────────────────────────────────
  it('shows NoData when no results match filter', async () => {
    renderPage()
    await waitFor(() => screen.getByText('admin'))
    fireEvent.change(screen.getByPlaceholderText(/search by user/i), {
      target: { value: 'zzznomatch' },
    })
    await waitFor(() => {
      expect(screen.getByText(/no audit logs found/i)).toBeInTheDocument()
    })
  })


})