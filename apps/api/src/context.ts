import * as admin from 'firebase-admin'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp()
}

export interface Context {
  user?: admin.auth.DecodedIdToken | undefined
  db: admin.firestore.Firestore
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<Context> {
  const { req } = opts
  
  // Get the authorization header
  const authHeader = req.headers.authorization
  let user: admin.auth.DecodedIdToken | undefined

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      user = await admin.auth().verifyIdToken(token)
    } catch (error) {
      console.error('Error verifying token:', error)
    }
  }

  return {
    user,
    db: admin.firestore(),
  }
} 