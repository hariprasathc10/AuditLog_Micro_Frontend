import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage'
import * as AuthContext from '../../context/AuthContext'
import * as authService from '../../services/authService'


vi.mock('../../services/authService', () => ({
  resetPassword: vi.fn(),
}))


vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAuth: () => ({
      user: { username: 'emp1' },
      logout: vi.fn(),
    }),
  }
})


const renderPage = () =>
  render(
    <MemoryRouter>
      <ResetPasswordPage />
    </MemoryRouter>
  )


describe('ResetPasswordPage', () => {


  it('renders password fields', () => {
    renderPage()
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })


  it('shows error when passwords do not match', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'pass123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'pass999' } })
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }))
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })


  it('shows error when password is too short', async () => {
    renderPage()
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: '123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }))
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
  })


  it('calls resetPassword service on valid submit', async () => {
    authService.resetPassword.mockResolvedValueOnce({})
    renderPage()
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newpass1' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'newpass1' } })
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }))
    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith('emp1', 'newpass1')
    })
  })


  it('shows success message after reset', async () => {
    authService.resetPassword.mockResolvedValueOnce({})
    renderPage()
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'newpass1' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'newpass1' } })
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }))
    await waitFor(() => {
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument()
    })
  })


})