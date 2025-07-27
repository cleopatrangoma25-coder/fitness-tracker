import { Router, Request, Response } from 'express'
import { auth } from 'firebase-admin'

const router: Router = Router()

// Basic health check
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Detailed health check with dependencies
router.get('/health/detailed', async (req: Request, res: Response) => {
  const health: {
    status: string
    timestamp: string
    uptime: number
    environment: string
    version: string
    checks: {
      firebase: string
      memory: string
      disk: string
    }
    memory?: any
    error?: string
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      firebase: 'unknown',
      memory: 'unknown',
      disk: 'unknown'
    }
  }

  try {
    // Check Firebase connection
    try {
      await auth().listUsers(1)
      health.checks.firebase = 'healthy'
    } catch {
      health.checks.firebase = 'unhealthy'
      health.status = 'degraded'
    }

    // Check memory usage
    const memUsage = process.memoryUsage()
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    }

    // Consider memory usage healthy if RSS is under 500MB
    if (memUsageMB.rss < 500) {
      health.checks.memory = 'healthy'
    } else {
      health.checks.memory = 'warning'
      if (health.status === 'healthy') health.status = 'degraded'
    }

    // Add memory usage to response
    health.memory = memUsageMB

    // Check disk space (basic check)
    health.checks.disk = 'healthy' // In a real app, you'd check actual disk space

    res.status(200).json(health)
  } catch {
    health.status = 'unhealthy'
    health.error = 'Unknown error'
    res.status(503).json(health)
  }
})

// Readiness check for Kubernetes
router.get('/ready', (req: Request, res: Response) => {
  // Add any readiness checks here (database connections, etc.)
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  })
})

// Liveness check for Kubernetes
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  })
})

// Metrics endpoint (basic)
router.get('/metrics', (req: Request, res: Response) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed,
      external: process.memoryUsage().external
    },
    cpu: process.cpuUsage(),
    // Add custom metrics here
    requests: {
      total: 0, // This would be tracked in a real app
      successful: 0,
      failed: 0
    }
  }

  res.status(200).json(metrics)
})

export default router 