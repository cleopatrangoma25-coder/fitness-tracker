'use client';

import { AuthDebugger } from '../components/auth/AuthDebugger'

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
          <h2 className="text-2xl font-semibold mb-4">Debug Information</h2>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-700">
              This page is for debugging authentication and other features.
              The example components have been removed as part of the cleanup.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 