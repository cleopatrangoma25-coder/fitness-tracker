import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@fitness-tracker/api'

export const trpc = createTRPCReact<AppRouter>()

// tRPC client configuration
export const trpcClient = {
  links: [
    // HTTP link for API calls
    {
      url: import.meta.env.VITE_API_URL || 'http://localhost:3001/trpc',
      headers: () => {
        // Get the current user's ID token for authentication
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (user?.accessToken) {
          return {
            authorization: `Bearer ${user.accessToken}`,
          }
        }
        return {}
      },
    },
  ],
} 