import * as functions from 'firebase-functions'
import { appRouter } from './trpc'
import { createContext } from './context'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

// tRPC API handler
export const api = functions.https.onRequest(async (req, res) => {
  const handler = fetchRequestHandler({
    endpoint: '/api/trpc',
    req: req as any,
    router: appRouter,
    createContext,
  })

  const response = await handler(req as any, res as any)
  return response
})

// Health check endpoint
export const health = functions.https.onRequest((req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
}) 