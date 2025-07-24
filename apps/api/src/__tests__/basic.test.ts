import request from 'supertest'
import { createTestApp } from './test-app'

describe('Basic API Tests', () => {
  let app: any

  beforeAll(() => {
    app = createTestApp()
  })

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'healthy')
      expect(response.body).toHaveProperty('timestamp')
    })

    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200)

      expect(response.body).toHaveProperty('status')
      expect(response.body).toHaveProperty('checks')
      expect(response.body.checks).toHaveProperty('firebase')
      expect(response.body.checks).toHaveProperty('memory')
      expect(response.body.checks).toHaveProperty('disk')
    })

    it('should return ready status', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'ready')
      expect(response.body).toHaveProperty('timestamp')
    })

    it('should return alive status', async () => {
      const response = await request(app)
        .get('/live')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'alive')
      expect(response.body).toHaveProperty('timestamp')
    })
  })
}) 