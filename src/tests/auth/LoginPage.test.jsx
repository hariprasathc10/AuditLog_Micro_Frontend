import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginPage from '../../pages/auth/LoginPage'
import * as AuthContext from '../../context/AuthContext'


const mockLogin = vi.fn()


const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthContext.AuthProvider>
        <LoginPage />
      </AuthContext.AuthProvider>
    </MemoryRouter>
  )


// ── Mock useAuth ──────────────────────────────────────
vi.mock('../../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      loading: false,
      error: null,
    }),
  }
})


describe('LoginPage', () => {


  it('renders login form', () => {
    renderLogin()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })


  it('shows validation error when fields are empty', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument()
    })
  })


  it('calls login with correct credentials', async () => {
    renderLogin()
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'admin123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin', 'admin123')
    })
  })


  it('shows error alert when login fails', () => {
    vi.mock('../../context/AuthContext', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        useAuth: () => ({
          login: mockLogin,
          loading: false,
          error: 'Invalid credentials',
        }),
      }
    })
    renderLogin()
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })


  it('disables button while loading', () => {
    vi.mock('../../context/AuthContext', async (importOriginal) => {
      const actual = await importOriginal()
      return {
        ...actual,
        useAuth: () => ({
          login: mockLogin,
          loading: true,
          error: null,
        }),
      }
    })
    renderLogin()
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()
  })


})