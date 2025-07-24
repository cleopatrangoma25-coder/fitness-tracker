import winston from 'winston'

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// Tell winston that you want to link the colors
winston.addColors(colors)

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// Define format for production (JSON format)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'production' ? productionFormat : format,
  }),
  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: productionFormat,
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: 'logs/all.log',
    format: productionFormat,
  }),
]

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: productionFormat,
  transports,
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
})

// Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim())
  },
}

// Helper functions for structured logging
export const logRequest = (req: any, res: any, duration: number) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.uid || 'anonymous',
  })
}

export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    context,
  })
}

export const logSecurity = (event: string, details: any) => {
  logger.warn('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
  })
}

export const logPerformance = (operation: string, duration: number, metadata?: any) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    metadata,
  })
}

export default logger 