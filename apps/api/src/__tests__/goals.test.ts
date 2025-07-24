import request from 'supertest'
import { createTestApp } from './test-app'

describe('Goals API', () => {
  let app: any

  beforeAll(() => {
    app = createTestApp()
  })

  const testGoal = {
    title: 'Test Goal',
    type: 'strength',
    category: 'fitness',
    target: 100,
    unit: 'lbs',
    deadline: '2024-12-31',
    difficulty: 'intermediate',
    priority: 'medium',
    description: 'Test goal description'
  }

  describe('GET /api/goals', () => {
    it('should return all goals for a user', async () => {
      const response = await request(app)
        .get('/api/goals?userId=user1')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('title')
      expect(response.body[0]).toHaveProperty('type')
    })

    it('should return empty array for non-existent user', async () => {
      const response = await request(app)
        .get('/api/goals?userId=non-existent-user')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(0)
    })
  })

  describe('POST /api/goals', () => {
    it('should create a new goal', async () => {
      const response = await request(app)
        .post('/api/goals?userId=user1')
        .send(testGoal)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.title).toBe(testGoal.title)
      expect(response.body.type).toBe(testGoal.type)
      expect(response.body.userId).toBe('user1')
      expect(response.body.current).toBe(0)
      expect(response.body.completed).toBe(false)
    })

    it('should validate required fields', async () => {
      const invalidGoal = {
        type: 'strength',
        target: 100
        // Missing required fields: title
      }

      const response = await request(app)
        .post('/api/goals?userId=user1')
        .send(invalidGoal)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should validate goal type', async () => {
      const invalidGoal = {
        ...testGoal,
        type: 'invalid-type'
      }

      const response = await request(app)
        .post('/api/goals?userId=user1')
        .send(invalidGoal)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('should validate target is positive', async () => {
      const invalidGoal = {
        ...testGoal,
        target: -10
      }

      const response = await request(app)
        .post('/api/goals?userId=user1')
        .send(invalidGoal)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /api/goals/:id', () => {
    it('should update an existing goal', async () => {
      // First create a goal
      const createResponse = await request(app)
        .post('/api/goals?userId=user1')
        .send(testGoal)
        .expect(201)

      const goalId = createResponse.body.id
      const updateData = {
        title: 'Updated Goal',
        description: 'Updated description'
      }

      const response = await request(app)
        .put(`/api/goals/${goalId}?userId=user1`)
        .send(updateData)
        .expect(200)

      expect(response.body.title).toBe(updateData.title)
      expect(response.body.description).toBe(updateData.description)
    })

    it('should return 404 for non-existent goal', async () => {
      const response = await request(app)
        .put('/api/goals/non-existent-id?userId=user1')
        .send({ title: 'Updated' })
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PATCH /api/goals/:id/progress', () => {
    it('should update goal progress', async () => {
      // First create a goal
      const createResponse = await request(app)
        .post('/api/goals?userId=user1')
        .send(testGoal)
        .expect(201)

      const goalId = createResponse.body.id
      const progressData = {
        current: 75
      }

      const response = await request(app)
        .patch(`/api/goals/${goalId}/progress?userId=user1`)
        .send(progressData)
        .expect(200)

      expect(response.body.current).toBe(progressData.current)
      expect(response.body.progress).toBe(75) // 75/100 = 75%
    })

    it('should mark goal as completed when target is reached', async () => {
      // First create a goal
      const createResponse = await request(app)
        .post('/api/goals?userId=user1')
        .send(testGoal)
        .expect(201)

      const goalId = createResponse.body.id
      const progressData = {
        current: 100 // Reached target
      }

      const response = await request(app)
        .patch(`/api/goals/${goalId}/progress?userId=user1`)
        .send(progressData)
        .expect(200)

      expect(response.body.current).toBe(progressData.current)
      expect(response.body.completed).toBe(true)
      expect(response.body.progress).toBe(100)
    })

    it('should return 404 for non-existent goal', async () => {
      const response = await request(app)
        .patch('/api/goals/non-existent-id/progress?userId=user1')
        .send({ current: 50 })
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('DELETE /api/goals/:id', () => {
    it('should delete an existing goal', async () => {
      // First create a goal
      const createResponse = await request(app)
        .post('/api/goals?userId=user1')
        .send(testGoal)
        .expect(201)

      const goalId = createResponse.body.id

      const response = await request(app)
        .delete(`/api/goals/${goalId}?userId=user1`)
        .expect(204)

      // Verify it's actually deleted
      const getResponse = await request(app)
        .get(`/api/goals/${goalId}?userId=user1`)
        .expect(404)
    })

    it('should return 404 for non-existent goal', async () => {
      const response = await request(app)
        .delete('/api/goals/non-existent-id?userId=user1')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })
}) 