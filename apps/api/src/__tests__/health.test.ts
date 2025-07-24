import request from 'supertest'
import { createTestApp } from './test-app'
import { auth } from 'firebase-admin'

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  auth: jest.fn(() => ({
    listUsers: jest.fn()
  }))
}))

describe('Health Check Endpoints', () => {
  let app: any

  beforeAll(() => {
    app = createTestApp()
  })

  describe('GET /health', () => {
    it('should return basic health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'healthy')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('environment')
      expect(response.body).toHaveProperty('version')
    })
  })

  describe('GET /health/detailed', () => {
    it('should return detailed health status with all checks', async () => {
      // Mock successful Firebase connection
      const mockListUsers = auth().listUsers as jest.MockedFunction<any>
      mockListUsers.mockResolvedValueOnce({ users: [] })

      const response = await request(app)
        .get('/health/detailed')
        .expect(200)

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('checks')
      expect(response.body.checks).toHaveProperty('firebase')
      expect(response.body.checks).toHaveProperty('memory')
      expect(response.body.checks).toHaveProperty('disk')
      expect(response.body).toHaveProperty('memory')
    })

    it('should return degraded status when Firebase is unhealthy', async () => {
      // Mock failed Firebase connection
      const mockListUsers = auth().listUsers as jest.MockedFunction<any>
      mockListUsers.mockRejectedValueOnce(new Error('Firebase connection failed'))

      const response = await request(app)
        .get('/health/detailed')
        .expect(200)

      expect(response.body.status).toBe('degraded')
      expect(response.body.checks.firebase).toBe('unhealthy')
    })

    afterEach(() => {
      // Reset mock after each test
      const mockListUsers = auth().listUsers as jest.MockedFunction<any>
      mockListUsers.mockReset()
    })
  })

  describe('GET /ready', () => {
    it('should return ready status', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'ready')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  describe('GET /live', () => {
    it('should return alive status', async () => {
      const response = await request(app)
        .get('/live')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'alive')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  describe('GET /metrics', () => {
    it('should return basic metrics', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200)

      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(response.body).toHaveProperty('memory')
      expect(response.body).toHaveProperty('cpu')
      expect(response.body).toHaveProperty('requests')
    })
  })
}) 