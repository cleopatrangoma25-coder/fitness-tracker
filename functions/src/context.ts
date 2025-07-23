import * as admin from 'firebase-admin'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp()
}

export interface Context {
  user?: admin.auth.DecodedIdToken
  db: admin.firestore.Firestore
}

export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<Context> {
  const { req } = opts
  
  // Get the authorization header
  const authHeader = req.headers.get('authorization')
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