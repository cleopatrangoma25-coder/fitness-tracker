# API Documentation

This document provides comprehensive documentation for the Fitness Tracker Pro tRPC API endpoints.

## 🔗 Base URL

- **Development**: `http://localhost:3001/trpc`
- **Staging**: `https://fitness-tracker-dev-4499e.web.app/api/trpc`
- **Production**: `https://fitness-tracker-11c7a.web.app/api/trpc`

## 🔐 Authentication

All protected endpoints require a valid Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

## 📋 Endpoints

### Health Checks

#### `health.check`
Check if the API is running.

**Method**: `GET`  
**Path**: `/health`  
**Authentication**: Not required

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### `health.detailed`
Get detailed health information including Firebase connectivity.

**Method**: `GET`  
**Path**: `/health/detailed`  
**Authentication**: Not required

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "firebase": "healthy",
    "database": "healthy"
  },
  "uptime": 3600
}
```

### User Management

#### `user.getProfile`
Get the current user's profile information.

**Method**: `GET`  
**Path**: `/user/profile`  
**Authentication**: Required

**Response**:
```json
{
  "id": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER",
  "preferences": {
    "units": "METRIC",
    "notifications": true,
    "privacy": "PRIVATE"
  },
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

#### `user.updateProfile`
Update the current user's profile information.

**Method**: `PUT`  
**Path**: `/user/profile`  
**Authentication**: Required

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "preferences": {
    "units": "METRIC",
    "notifications": true,
    "privacy": "PRIVATE"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "preferences": {
      "units": "METRIC",
      "notifications": true,
      "privacy": "PRIVATE"
    },
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

### Workout Management

#### `workout.create`
Create a new workout.

**Method**: `POST`  
**Path**: `/workout`  
**Authentication**: Required

**Request Body**:
```json
{
  "name": "Morning Workout",
  "date": "2024-12-19T10:30:00.000Z",
  "durationMinutes": 45,
  "exercises": [
    {
      "exerciseId": "ex123",
      "name": "Push-ups",
      "sets": [
        {
          "reps": 10,
          "weight": 0,
          "completed": true
        }
      ]
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Workout created successfully",
  "workout": {
    "id": "workout123",
    "userId": "user123",
    "name": "Morning Workout",
    "date": "2024-12-19T10:30:00.000Z",
    "durationMinutes": 45,
    "exercises": [...],
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

#### `workout.getAll`
Get all workouts for the current user.

**Method**: `GET`  
**Path**: `/workout`  
**Authentication**: Required

**Query Parameters**:
- `limit` (optional): Number of workouts to return (default: 50)
- `offset` (optional): Number of workouts to skip (default: 0)
- `startDate` (optional): Filter workouts from this date
- `endDate` (optional): Filter workouts until this date

**Response**:
```json
{
  "workouts": [
    {
      "id": "workout123",
      "name": "Morning Workout",
      "date": "2024-12-19T10:30:00.000Z",
      "durationMinutes": 45,
      "exerciseCount": 3,
      "createdAt": "2024-12-19T10:30:00.000Z"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

#### `workout.getById`
Get a specific workout by ID.

**Method**: `GET`  
**Path**: `/workout/{id}`  
**Authentication**: Required

**Response**:
```json
{
  "id": "workout123",
  "userId": "user123",
  "name": "Morning Workout",
  "date": "2024-12-19T10:30:00.000Z",
  "durationMinutes": 45,
  "exercises": [
    {
      "exerciseId": "ex123",
      "name": "Push-ups",
      "sets": [
        {
          "reps": 10,
          "weight": 0,
          "completed": true
        }
      ]
    }
  ],
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

#### `workout.update`
Update an existing workout.

**Method**: `PUT`  
**Path**: `/workout/{id}`  
**Authentication**: Required

**Request Body**: Same as create workout

**Response**:
```json
{
  "success": true,
  "message": "Workout updated successfully",
  "workout": {
    "id": "workout123",
    "name": "Updated Workout",
    "date": "2024-12-19T10:30:00.000Z",
    "durationMinutes": 60,
    "exercises": [...],
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

#### `workout.delete`
Delete a workout.

**Method**: `DELETE`  
**Path**: `/workout/{id}`  
**Authentication**: Required

**Response**:
```json
{
  "success": true,
  "message": "Workout deleted successfully"
}
```

### Exercise Management

#### `exercise.getAll`
Get all available exercises.

**Method**: `GET`  
**Path**: `/exercise`  
**Authentication**: Not required

**Query Parameters**:
- `muscleGroup` (optional): Filter by muscle group
- `equipment` (optional): Filter by required equipment

**Response**:
```json
{
  "exercises": [
    {
      "id": "ex123",
      "name": "Push-ups",
      "muscleGroup": "CHEST",
      "equipment": [],
      "instructions": "Start in plank position...",
      "createdAt": "2024-12-19T10:30:00.000Z",
      "updatedAt": "2024-12-19T10:30:00.000Z"
    }
  ]
}
```

#### `exercise.getById`
Get a specific exercise by ID.

**Method**: `GET`  
**Path**: `/exercise/{id}`  
**Authentication**: Not required

**Response**:
```json
{
  "id": "ex123",
  "name": "Push-ups",
  "muscleGroup": "CHEST",
  "equipment": [],
  "instructions": "Start in plank position...",
  "createdAt": "2024-12-19T10:30:00.000Z",
  "updatedAt": "2024-12-19T10:30:00.000Z"
}
```

### Goal Management

#### `goal.create`
Create a new fitness goal.

**Method**: `POST`  
**Path**: `/goal`  
**Authentication**: Required

**Request Body**:
```json
{
  "type": "WEIGHT",
  "title": "Lose 10kg",
  "description": "Goal to lose 10kg by end of year",
  "targetValue": 10,
  "unit": "kg",
  "startDate": "2024-12-19T10:30:00.000Z",
  "deadline": "2024-12-31T23:59:59.000Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Goal created successfully",
  "goal": {
    "id": "goal123",
    "userId": "user123",
    "type": "WEIGHT",
    "title": "Lose 10kg",
    "description": "Goal to lose 10kg by end of year",
    "targetValue": 10,
    "currentValue": 0,
    "unit": "kg",
    "status": "ACTIVE",
    "startDate": "2024-12-19T10:30:00.000Z",
    "deadline": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-12-19T10:30:00.000Z",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

#### `goal.getAll`
Get all goals for the current user.

**Method**: `GET`  
**Path**: `/goal`  
**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by goal status (ACTIVE, COMPLETED, PAUSED)

**Response**:
```json
{
  "goals": [
    {
      "id": "goal123",
      "type": "WEIGHT",
      "title": "Lose 10kg",
      "targetValue": 10,
      "currentValue": 5,
      "unit": "kg",
      "status": "ACTIVE",
      "progress": 50,
      "deadline": "2024-12-31T23:59:59.000Z"
    }
  ]
}
```

#### `goal.update`
Update a goal's current value or status.

**Method**: `PUT`  
**Path**: `/goal/{id}`  
**Authentication**: Required

**Request Body**:
```json
{
  "currentValue": 7,
  "status": "ACTIVE"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Goal updated successfully",
  "goal": {
    "id": "goal123",
    "currentValue": 7,
    "progress": 70,
    "status": "ACTIVE",
    "updatedAt": "2024-12-19T10:30:00.000Z"
  }
}
```

### Analytics & Statistics

#### `analytics.getWorkoutStats`
Get workout statistics for the current user.

**Method**: `GET`  
**Path**: `/analytics/workout-stats`  
**Authentication**: Required

**Query Parameters**:
- `period` (optional): Time period (week, month, year, all) (default: month)

**Response**:
```json
{
  "totalWorkouts": 15,
  "totalDuration": 675,
  "averageDuration": 45,
  "workoutsThisWeek": 3,
  "workoutsThisMonth": 12,
  "favoriteExercises": [
    {
      "name": "Push-ups",
      "count": 8
    }
  ],
  "muscleGroupDistribution": {
    "CHEST": 5,
    "BACK": 4,
    "LEGS": 6
  }
}
```

#### `analytics.getProgress`
Get progress tracking data.

**Method**: `GET`  
**Path**: `/analytics/progress`  
**Authentication**: Required

**Query Parameters**:
- `goalId` (optional): Specific goal ID to track
- `period` (optional): Time period (week, month, year)

**Response**:
```json
{
  "goalProgress": [
    {
      "date": "2024-12-19",
      "value": 5,
      "target": 10
    }
  ],
  "workoutTrends": [
    {
      "date": "2024-12-19",
      "workouts": 1,
      "duration": 45
    }
  ]
}
```

## 🚨 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "UNAUTHORIZED",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "FORBIDDEN",
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_ERROR",
  "message": "An unexpected error occurred"
}
```

## 📝 Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **API endpoints**: 100 requests per 15 minutes
- **Health checks**: No limit

## 🔧 Testing

You can test the API endpoints using the tRPC client or tools like Postman. For local development, the API is available at `http://localhost:3001/trpc`.

### Example with curl:
```bash
# Health check
curl http://localhost:3001/trpc/health.check

# Get user profile (with auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/trpc/user.getProfile
```

## 📚 Additional Resources

- [tRPC Documentation](https://trpc.io/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore) 