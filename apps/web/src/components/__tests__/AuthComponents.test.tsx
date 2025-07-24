import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SignInForm } from '../auth/SignInForm'
import { SignUpForm } from '../auth/SignUpForm'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock Firebase Auth
vi.mock('../../lib/auth', () => ({
  AuthService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => () => {}),
    getUserProfile: vi.fn(),
  }
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Authentication Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SignInForm', () => {
    it('should render sign in form with all fields', () => {
      renderWithRouter(<SignInForm onSwitchToSignUp={vi.fn()} />)
      
      expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('should show validation errors for invalid email', async () => {
      renderWithRouter(<SignInForm onSwitchToSignUp={vi.fn()} />)
      
      const emailInput = screen.getByPlaceholderText(/john@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        // Check for any validation error message related to email
        const errorElement = screen.queryByText(/email/i) || screen.queryByText(/invalid/i)
        expect(errorElement).toBeInTheDocument()
      })
    })

    it('should show validation errors for empty password', async () => {
      renderWithRouter(<SignInForm onSwitchToSignUp={vi.fn()} />)
      
      const emailInput = screen.getByPlaceholderText(/john@example.com/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/string must contain at least 1 character/i)).toBeInTheDocument()
      })
    })

    it('should show loading state during submission', async () => {
      const { AuthService } = await import('../../lib/auth')
      vi.mocked(AuthService.signIn).mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )
      
      renderWithRouter(<SignInForm onSwitchToSignUp={vi.fn()} />)
      
      const emailInput = screen.getByPlaceholderText(/john@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
      
      // Check for loading state immediately after click
      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('SignUpForm', () => {
    it('should render sign up form with all fields', () => {
      renderWithRouter(<SignUpForm onSwitchToSignIn={vi.fn()} />)
      
      expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should show validation error for weak password', async () => {
      renderWithRouter(<SignUpForm onSwitchToSignIn={vi.fn()} />)
      
      const emailInput = screen.getByPlaceholderText(/john@example.com/i)
      const passwordInput = screen.getByPlaceholderText(/••••••••/i)
      const submitButton = screen.getByRole('button', { name: /create account/i })
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'weak' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/string must contain at least 8 character/i)).toBeInTheDocument()
      })
    })


  })
}) 