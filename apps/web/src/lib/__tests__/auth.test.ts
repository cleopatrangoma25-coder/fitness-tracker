import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from '../auth'
import type { SignUpInput, SignInInput } from '@fitness-tracker/shared'

// Mock Firebase
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  updateProfile: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    it('should create a new user successfully', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-user-id',
        },
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential)
      mockFirebaseAuth.updateProfile.mockResolvedValue(undefined)

      const mockFirestore = require('firebase/firestore')
      mockFirestore.setDoc.mockResolvedValue(undefined)

      const signUpData: SignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
      }

      const result = await AuthService.signUp(signUpData)

      expect(result).toEqual({
        userId: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        preferences: {
          units: 'METRIC',
          notifications: true,
          privacy: 'PRIVATE',
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should handle email already in use error', async () => {
      const mockError = {
        code: 'auth/email-already-in-use',
        message: 'Email already in use',
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(mockError)

      const signUpData: SignUpInput = {
        email: 'existing@example.com',
        password: 'password123',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
      }

      await expect(AuthService.signUp(signUpData)).rejects.toThrow(
        'An account with this email already exists. Please try signing in instead.'
      )
    })

    it('should handle weak password error', async () => {
      const mockError = {
        code: 'auth/weak-password',
        message: 'Password is too weak',
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(mockError)

      const signUpData: SignUpInput = {
        email: 'test@example.com',
        password: '123',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
      }

      await expect(AuthService.signUp(signUpData)).rejects.toThrow(
        'Password should be at least 6 characters long.'
      )
    })
  })

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-user-id',
        },
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.signInWithEmailAndPassword.mockResolvedValue(mockUserCredential)

      const mockFirestore = require('firebase/firestore')
      mockFirestore.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: 'test@example.com',
          displayName: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          role: 'USER',
          preferences: {
            units: 'METRIC',
            notifications: true,
            privacy: 'PRIVATE',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      })

      const signInData: SignInInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = await AuthService.signIn(signInData)

      expect(result).toEqual({
        userId: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        preferences: {
          units: 'METRIC',
          notifications: true,
          privacy: 'PRIVATE',
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should handle user not found error', async () => {
      const mockError = {
        code: 'auth/user-not-found',
        message: 'User not found',
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.signInWithEmailAndPassword.mockRejectedValue(mockError)

      const signInData: SignInInput = {
        email: 'nonexistent@example.com',
        password: 'password123',
      }

      await expect(AuthService.signIn(signInData)).rejects.toThrow(
        'No account found with this email address.'
      )
    })

    it('should handle wrong password error', async () => {
      const mockError = {
        code: 'auth/wrong-password',
        message: 'Wrong password',
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.signInWithEmailAndPassword.mockRejectedValue(mockError)

      const signInData: SignInInput = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      await expect(AuthService.signIn(signInData)).rejects.toThrow(
        'Incorrect password. Please try again.'
      )
    })
  })

  describe('sendPasswordReset', () => {
    it('should send password reset email successfully', async () => {
      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.sendPasswordResetEmail.mockResolvedValue(undefined)

      await expect(AuthService.sendPasswordReset('test@example.com')).resolves.toBeUndefined()
    })

    it('should handle network error', async () => {
      const mockError = {
        code: 'auth/network-request-failed',
        message: 'Network error',
      }

      const mockFirebaseAuth = require('firebase/auth')
      mockFirebaseAuth.sendPasswordResetEmail.mockRejectedValue(mockError)

      await expect(AuthService.sendPasswordReset('test@example.com')).rejects.toThrow(
        'Network error. Please check your connection and try again.'
      )
    })
  })

  describe('getAuthErrorMessage', () => {
    it('should return user-friendly error messages', () => {
      const testCases = [
        {
          error: { code: 'auth/email-already-in-use' },
          expected: 'An account with this email already exists. Please try signing in instead.',
        },
        {
          error: { code: 'auth/invalid-email' },
          expected: 'Please enter a valid email address.',
        },
        {
          error: { code: 'auth/weak-password' },
          expected: 'Password should be at least 6 characters long.',
        },
        {
          error: { code: 'auth/user-not-found' },
          expected: 'No account found with this email address.',
        },
        {
          error: { code: 'auth/wrong-password' },
          expected: 'Incorrect password. Please try again.',
        },
        {
          error: { code: 'auth/too-many-requests' },
          expected: 'Too many failed attempts. Please try again later.',
        },
        {
          error: { code: 'auth/network-request-failed' },
          expected: 'Network error. Please check your connection and try again.',
        },
        {
          error: { code: 'auth/unknown-error', message: 'Unknown error' },
          expected: 'Unknown error',
        },
        {
          error: 'String error',
          expected: 'String error',
        },
      ]

      testCases.forEach(({ error, expected }) => {
        // Access the private method through the class instance
        const authService = new AuthService()
        const result = (AuthService as any).getAuthErrorMessage(error)
        expect(result).toBe(expected)
      })
    })
  })
}) 