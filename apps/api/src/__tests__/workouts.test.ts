import request from 'supertest'
import { createTestApp } from './test-app'

describe('Workouts API', () => {
  let app: any

  beforeAll(() => {
    app = createTestApp()
  })

  const testWorkout = {
    name: 'Test Workout',
    type: 'strength',
    duration: 45,
    calories: 300,
    date: '2024-01-15',
    completed: true,
    exercises: [],
    notes: 'Test workout notes'
  }

  describe('GET /api/workouts', () => {
    it('should return all workouts for a user', async () => {
      const response = await request(app)
        .get('/api/workouts?userId=user1')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('name')
      expect(response.body[0]).toHaveProperty('type')
    })

    it('should return empty array for non-existent user', async () => {
      const response = await request(app)
        .get('/api/workouts?userId=non-existent-user')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(0)
    })
  })

  describe('POST /api/workouts', () => {
    it('should create a new workout', async () => {
      const response = await request(app)
        .post('/api/workouts?userId=user1')
        .send(testWorkout)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe(testWorkout.name)
      expect(response.body.type).toBe(testWorkout.type)
      expect(response.body.userId).toBe('user1')
    })

    it('should validate required fields', async () => {
      const invalidWorkout = {
        type: 'strength',
        duration: 45
        // Missing required fields: name
      }

      const response = await request(app)
        .post('/api/workouts?userId=user1')
        .send(invalidWorkout)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should validate workout type', async () => {
      const invalidWorkout = {
        ...testWorkout,
        type: 'invalid-type'
      }

      const response = await request(app)
        .post('/api/workouts?userId=user1')
        .send(invalidWorkout)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /api/workouts/:id', () => {
    it('should update an existing workout', async () => {
      // First create a workout
      const createResponse = await request(app)
        .post('/api/workouts?userId=user1')
        .send(testWorkout)
        .expect(201)

      const workoutId = createResponse.body.id
      const updateData = {
        name: 'Updated Workout',
        duration: 60,
        notes: 'Updated notes'
      }

      const response = await request(app)
        .put(`/api/workouts/${workoutId}?userId=user1`)
        .send(updateData)
        .expect(200)

      expect(response.body.name).toBe(updateData.name)
      expect(response.body.duration).toBe(updateData.duration)
      expect(response.body.notes).toBe(updateData.notes)
    })

    it('should return 404 for non-existent workout', async () => {
      const response = await request(app)
        .put('/api/workouts/non-existent-id?userId=user1')
        .send({ name: 'Updated' })
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('DELETE /api/workouts/:id', () => {
    it('should delete an existing workout', async () => {
      // First create a workout
      const createResponse = await request(app)
        .post('/api/workouts?userId=user1')
        .send(testWorkout)
        .expect(201)

      const workoutId = createResponse.body.id

      const response = await request(app)
        .delete(`/api/workouts/${workoutId}?userId=user1`)
        .expect(204)

      // Verify it's actually deleted by trying to get it
      const getResponse = await request(app)
        .get(`/api/workouts/${workoutId}?userId=user1`)
        .expect(404)
    })

    it('should return 404 for non-existent workout', async () => {
      const response = await request(app)
        .delete('/api/workouts/non-existent-id?userId=user1')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
}) 