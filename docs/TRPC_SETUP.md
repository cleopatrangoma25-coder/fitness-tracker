# tRPC Setup Documentation

## Overview

This project now includes a tRPC backend API server that provides type-safe API endpoints for the fitness tracking application. The setup includes:

- **Backend**: Express + tRPC server (`apps/api`)
- **Frontend**: React + tRPC client (`apps/web`)
- **Shared Types**: TypeScript types and Zod schemas (`packages/shared`)

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   tRPC API      │    │   Firebase      │
│   (React)       │◄──►│   (Express)     │◄──►│   (Firestore)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Getting Started

### 1. Start the API Server

```bash
# Start the tRPC API server
pnpm --filter @fitness-tracker/api dev

# The server will run on http://localhost:3001
# tRPC endpoint: http://localhost:3001/trpc
```

### 2. Start the Web App

```bash
# Start the React web app
pnpm --filter @fitness-tracker/web dev

# The app will run on http://localhost:3000
```

### 3. Test the Setup

Visit `http://localhost:3000/debug` to see the tRPC example component in action.

## API Endpoints

### User Management
- `user.getProfile` - Get current user profile
- `user.updateProfile` - Update user profile

### Workout Management
- `workout.create` - Create a new workout
- `workout.list` - List user workouts
- `workout.getById` - Get specific workout
- `workout.delete` - Delete a workout

### Goal Management
- `goal.create` - Create a new goal
- `goal.listActive` - List active goals
- `goal.updateProgress` - Update goal progress

## Usage Examples

### Frontend (React Component)

```typescript
import { trpc } from '../lib/trpc'

function MyComponent() {
  // Query data
  const { data: userProfile, isLoading } = trpc.user.getProfile.useQuery()
  
  // Mutation
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      // Refetch data after mutation
      utils.user.getProfile.invalidate()
    },
  })
  
  const utils = trpc.useUtils()
  
  const handleUpdate = () => {
    updateProfile.mutate({
      displayName: 'New Name',
    })
  }
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{userProfile?.displayName}</h1>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  )
}
```

### Backend (Adding New Endpoints)

```typescript
// In apps/api/src/trpc.ts

const newRouter = router({
  getData: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.db.collection('collection').doc(input.id).get()
      return doc.data()
    }),
    
  createData: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const docRef = await ctx.db.collection('collection').add({
        ...input,
        userId: ctx.user!.uid,
        createdAt: new Date(),
      })
      return { id: docRef.id, ...input }
    }),
})

// Add to main router
export const appRouter = router({
  user: userRouter,
  workout: workoutRouter,
  goal: goalRouter,
  new: newRouter, // Add your new router
})
```

## Authentication

The tRPC API uses Firebase Authentication. The frontend automatically includes the user's ID token in API requests:

```typescript
// In main.tsx - tRPC client setup
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      headers: () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (user?.accessToken) {
          return {
            authorization: `Bearer ${user.accessToken}`,
          }
        }
        return {}
      },
    }),
  ],
})
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/trpc
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
```

## Development Workflow

1. **Add new schemas** in `packages/shared/src/schemas.ts`
2. **Build shared package**: `pnpm --filter @fitness-tracker/shared build`
3. **Add new endpoints** in `apps/api/src/trpc.ts`
4. **Build API package**: `pnpm --filter @fitness-tracker/api build`
5. **Use in frontend** with full type safety

## Benefits of tRPC

1. **Type Safety**: End-to-end type safety between frontend and backend
2. **Auto-completion**: IDE support for all API calls
3. **Runtime Validation**: Zod schemas validate data at runtime
4. **Batch Requests**: Multiple queries can be batched into single HTTP requests
5. **Real-time Updates**: Built-in support for subscriptions (if needed)
6. **Error Handling**: Consistent error handling across the stack

## Troubleshooting

### Common Issues

1. **Type errors**: Make sure to build the shared package after schema changes
2. **Import errors**: Check that the API package is properly linked in the web app
3. **Authentication errors**: Verify that the user is logged in and the token is valid
4. **CORS errors**: Check that the API server CORS settings match your frontend URL

### Debug Commands

```bash
# Check if servers are running
netstat -ano | findstr :3001  # API server
netstat -ano | findstr :3000  # Web app

# Test API health
curl http://localhost:3001/health

# Build all packages
pnpm build
``` 