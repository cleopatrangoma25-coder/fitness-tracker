import request from 'supertest'
import { createTestApp } from './test-app'

describe('Profile API', () => {
  let app: any

  beforeAll(() => {
    app = createTestApp()
  })

  const testProfile = {
    firstName: 'Test',
    lastName: 'User',
    displayName: 'TestUser',
    email: 'test@example.com',
    age: 25,
    height: 175,
    weight: 70,
    fitnessLevel: 'intermediate',
    bio: 'Test bio'
  }

  describe('GET /api/profile/:userId', () => {
    it('should return user profile', async () => {
      const response = await request(app)
        .get('/api/profile/user1')
        .expect(200)

      expect(response.body).toHaveProperty('id', 'user1')
      expect(response.body).toHaveProperty('displayName')
      expect(response.body).toHaveProperty('email')
    })

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/profile/non-existent-user')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /api/profile/:userId', () => {
    it('should update an existing profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
        displayName: 'UpdatedUser',
        email: 'updated@example.com',
        age: 26,
        height: 180,
        weight: 75,
        fitnessLevel: 'advanced',
        bio: 'Updated bio'
      }

      const response = await request(app)
        .put('/api/profile/user1')
        .send(updateData)
        .expect(200)

      expect(response.body.displayName).toBe(updateData.displayName)
      expect(response.body.bio).toBe(updateData.bio)
      expect(response.body.age).toBe(updateData.age)
    })

    it('should return 404 for non-existent profile', async () => {
      const response = await request(app)
        .put('/api/profile/non-existent-user')
        .send(testProfile)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })

    it('should validate profile data', async () => {
      const invalidProfile = {
        firstName: 'Test',
        lastName: 'User',
        displayName: 'TestUser',
        email: 'invalid-email',
        age: 25,
        height: 175,
        weight: 70,
        fitnessLevel: 'intermediate'
      }

      const response = await request(app)
        .put('/api/profile/user1')
        .send(invalidProfile)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PATCH /api/profile/:userId/preferences', () => {
    it('should update user preferences', async () => {
      const preferencesData = {
        units: 'imperial',
        notifications: {
          workoutReminders: false,
          goalUpdates: true,
          achievements: true,
          weeklyReports: false
        }
      }

      const response = await request(app)
        .patch('/api/profile/user1/preferences')
        .send(preferencesData)
        .expect(200)

      expect(response.body.preferences.units).toBe(preferencesData.units)
      expect(response.body.preferences.notifications.workoutReminders).toBe(false)
    })

    it('should return 404 for non-existent profile', async () => {
      const response = await request(app)
        .patch('/api/profile/non-existent-user/preferences')
        .send({ units: 'imperial' })
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
}) 