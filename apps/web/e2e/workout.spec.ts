import { test, expect } from '@playwright/test'

test.describe('Workout Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        uid: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User'
      }))
    })
    
    await page.goto('/workout')
  })

  test('should display workout page with navigation', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /workouts/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /new workout/i })).toBeVisible()
  })

  test('should open new workout form', async ({ page }) => {
    await page.getByRole('button', { name: /new workout/i }).click()
    
    await expect(page.getByRole('heading', { name: /new workout/i })).toBeVisible()
    await expect(page.getByLabel(/workout name/i)).toBeVisible()
    await expect(page.getByLabel(/date/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /save workout/i })).toBeVisible()
  })

  test('should show validation errors for empty workout name', async ({ page }) => {
    await page.getByRole('button', { name: /new workout/i }).click()
    
    await page.getByRole('button', { name: /save workout/i }).click()
    
    await expect(page.getByText(/workout name is required/i)).toBeVisible()
  })

  test('should add exercise to workout', async ({ page }) => {
    await page.getByRole('button', { name: /new workout/i }).click()
    
    await page.getByLabel(/workout name/i).fill('Test Workout')
    await page.getByRole('button', { name: /add exercise/i }).click()
    
    await expect(page.getByText(/exercise name/i)).toBeVisible()
    await expect(page.getByLabel(/sets/i)).toBeVisible()
    await expect(page.getByLabel(/reps/i)).toBeVisible()
  })

  test('should display workout history', async ({ page }) => {
    // Mock workout data
    await page.addInitScript(() => {
      localStorage.setItem('workouts', JSON.stringify([
        {
          id: '1',
          name: 'Test Workout',
          date: new Date().toISOString(),
          exercises: []
        }
      ]))
    })
    
    await page.reload()
    
    await expect(page.getByText('Test Workout')).toBeVisible()
  })

  test('should edit existing workout', async ({ page }) => {
    // Mock workout data
    await page.addInitScript(() => {
      localStorage.setItem('workouts', JSON.stringify([
        {
          id: '1',
          name: 'Test Workout',
          date: new Date().toISOString(),
          exercises: []
        }
      ]))
    })
    
    await page.reload()
    
    await page.getByRole('button', { name: /edit/i }).first().click()
    
    await expect(page.getByLabel(/workout name/i)).toHaveValue('Test Workout')
  })

  test('should delete workout with confirmation', async ({ page }) => {
    // Mock workout data
    await page.addInitScript(() => {
      localStorage.setItem('workouts', JSON.stringify([
        {
          id: '1',
          name: 'Test Workout',
          date: new Date().toISOString(),
          exercises: []
        }
      ]))
    })
    
    await page.reload()
    
    await page.getByRole('button', { name: /delete/i }).first().click()
    
    // Should show confirmation dialog
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/are you sure/i)).toBeVisible()
  })
}) 