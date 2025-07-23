import { Router } from 'express';
import { z } from 'zod';
import { WorkoutFormSchema } from '@fitness-tracker/shared';

const router: Router = Router();

// In-memory storage (replace with database in production)
let workouts: any[] = [
  {
    id: '1',
    name: 'Morning Cardio',
    type: 'cardio',
    duration: 30,
    calories: 250,
    date: '2024-01-15',
    completed: true,
    exercises: [],
    notes: 'Great morning session!',
    userId: 'user1'
  },
  {
    id: '2',
    name: 'Strength Training',
    type: 'strength',
    duration: 45,
    calories: 320,
    date: '2024-01-14',
    completed: true,
    exercises: [],
    notes: 'Focused on upper body',
    userId: 'user1'
  },
  {
    id: '3',
    name: 'Yoga Session',
    type: 'flexibility',
    duration: 60,
    calories: 180,
    date: '2024-01-13',
    completed: true,
    exercises: [],
    notes: 'Relaxing session',
    userId: 'user1'
  }
];

// Get all workouts for a user
router.get('/', (req, res) => {
  const userId = req.query.userId || 'user1'; // In production, get from auth
  const userWorkouts = workouts.filter(w => w.userId === userId);
  
  // Simulate API delay
  setTimeout(() => {
    res.json(userWorkouts);
  }, 500);
});

// Create a new workout
router.post('/', (req, res) => {
  try {
    const validatedData = WorkoutFormSchema.parse(req.body);
    const userId = req.query.userId || 'user1'; // In production, get from auth
    
    const newWorkout = {
      id: crypto.randomUUID(),
      ...validatedData,
      completed: true,
      exercises: [],
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    workouts.push(newWorkout);
    
    return res.status(201).json(newWorkout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update a workout
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || 'user1';
    const workoutIndex = workouts.findIndex(w => w.id === id && w.userId === userId);
    
    if (workoutIndex === -1) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    
    const validatedData = WorkoutFormSchema.partial().parse(req.body);
    
    workouts[workoutIndex] = {
      ...workouts[workoutIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    return res.json(workouts[workoutIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors 
      });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Delete a workout
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId || 'user1';
  const workoutIndex = workouts.findIndex(w => w.id === id && w.userId === userId);
  
  if (workoutIndex === -1) {
    return res.status(404).json({ error: 'Workout not found' });
  }
  
  workouts.splice(workoutIndex, 1);
  return res.status(204).send();
});

export default router; 