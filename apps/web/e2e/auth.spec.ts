import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display sign in form', async ({ page }) => {
    await page.goto('/auth')
    
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should navigate to sign up form', async ({ page }) => {
    await page.goto('/auth')
    
    await page.getByRole('link', { name: /create account/i }).click()
    
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/auth')
    
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid email address/i)).toBeVisible()
  })

  test('should show validation errors for short password', async ({ page }) => {
    await page.goto('/auth')
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })

  test('should show password mismatch error on sign up', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('link', { name: /create account/i }).click()
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('differentpassword')
    await page.getByRole('button', { name: /sign up/i }).click()
    
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should redirect to dashboard after successful sign in', async ({ page }) => {
    // This test would require a test user account or mocking
    // For now, we'll test the redirect logic
    await page.goto('/auth')
    
    // Mock successful authentication
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User'
      }))
    })
    
    await page.reload()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
  })
}) 