'use client';

import { AuthDebugger } from '../components/auth/AuthDebugger'
import { TrpcExample } from '../components/examples/TrpcExample'

export function DebugPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Authentication Debug</h2>
          <AuthDebugger />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">tRPC Debug</h2>
          <TrpcExample />
        </div>
      </div>
    </div>
  )
} 