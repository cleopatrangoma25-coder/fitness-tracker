import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cors from 'cors'

// Rate limiting configuration
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
  })
}

// Stricter rate limiter for auth endpoints
export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 5) // 5 attempts per 15 minutes

// General API rate limiter
export const apiRateLimiter = createRateLimiter(15 * 60 * 1000, 100) // 100 requests per 15 minutes

// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://fitness-tracker-11c7a.web.app',
        'https://fitness-tracker-dev-4499e.web.app'
      ]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://firebase.googleapis.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
})

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  // Check for suspicious patterns in request body
  const body = JSON.stringify(req.body).toLowerCase()
  const suspiciousPatterns = [
    '<script',
    'javascript:',
    'onload=',
    'onerror=',
    'eval(',
    'document.cookie',
    'window.location'
  ]
  
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
    body.includes(pattern)
  )
  
  if (hasSuspiciousPattern) {
    res.status(400).json({
      error: 'Invalid input detected'
    })
    return
  }
  
  next()
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`)
  })
  
  next()
}

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message
  
  res.status(500).json({
    error: message
  })
}

// Not found handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found'
  })
} 