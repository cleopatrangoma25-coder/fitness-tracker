import express, { Application } from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from '../trpc'
import { 
  corsOptions, 
  securityHeaders, 
  apiRateLimiter, 
  authRateLimiter,
  validateInput,
  requestLogger,
  errorHandler,
  notFoundHandler
} from '../middleware/security'
import healthRoutes from '../routes/health'
import workoutRoutes from '../routes/workouts'
import goalRoutes from '../routes/goals'
import profileRoutes from '../routes/profile'

// Create test app without starting server
export const createTestApp = (): Application => {
  const app: Application = express()

  // Security middleware
  app.use(securityHeaders)
  app.use(cors(corsOptions))
  app.use(requestLogger)

  // Rate limiting
  app.use('/trpc/auth', authRateLimiter)
  app.use('/trpc', apiRateLimiter)

  // Body parsing
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))

  // Input validation
  app.use(validateInput)

  // Health check routes
  app.use('/', healthRoutes)

  // REST API routes
  app.use('/api/workouts', workoutRoutes)
  app.use('/api/goals', goalRoutes)
  app.use('/api/profile', profileRoutes)

  // tRPC middleware (with mocked context for tests)
  app.use('/trpc', createExpressMiddleware({
    router: appRouter,
    createContext: () => ({ 
      user: undefined, 
      db: {} as any // Mock Firestore
    }),
  }))

  // Error handling
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
} 