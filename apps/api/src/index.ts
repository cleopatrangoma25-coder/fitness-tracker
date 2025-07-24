import express, { Application } from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './trpc'
import { createContext } from './context'
import { 
  corsOptions, 
  securityHeaders, 
  apiRateLimiter, 
  authRateLimiter,
  validateInput,
  requestLogger,
  errorHandler,
  notFoundHandler
} from './middleware/security'
import healthRoutes from './routes/health'
import workoutRoutes from './routes/workouts'
import goalRoutes from './routes/goals'
import profileRoutes from './routes/profile'
import logger from './utils/logger'

const app: Application = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(securityHeaders)
app.use(cors(corsOptions))
app.use(requestLogger)

// Rate limiting
app.use('/trpc/auth', authRateLimiter) // Stricter rate limiting for auth endpoints
app.use('/trpc', apiRateLimiter) // General rate limiting for all tRPC endpoints

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

// tRPC middleware
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}))

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 tRPC API server running on port ${PORT}`)
  logger.info(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`)
  logger.info(`🏥 Health check: http://localhost:${PORT}/health`)
})

export { app }
export type AppRouter = typeof appRouter 