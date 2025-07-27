import { Router } from 'express';
import { z } from 'zod';
import { GoalFormSchema } from '@fitness-tracker/shared';

const router: Router = Router();

// In-memory storage (replace with database in production)
const goals: any[] = [
  {
    id: '1',
    title: 'Lose 10kg',
    type: 'weight',
    category: 'health',
    target: 70,
    current: 75,
    unit: 'kg',
    deadline: '2024-03-15',
    difficulty: 'intermediate',
    priority: 'high',
    completed: false,
    progress: 50,
    description: 'Lose weight and improve overall health',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    userId: 'user1'
  },
  {
    id: '2',
    title: 'Run 5km in 25 minutes',
    type: 'endurance',
    category: 'performance',
    target: 25,
    current: 30,
    unit: 'minutes',
    deadline: '2024-02-28',
    difficulty: 'advanced',
    priority: 'medium',
    completed: false,
    progress: 20,
    description: 'Improve running endurance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    userId: 'user1'
  },
  {
    id: '3',
    title: 'Complete 100 push-ups',
    type: 'strength',
    category: 'fitness',
    target: 100,
    current: 85,
    unit: 'reps',
    deadline: '2024-02-15',
    difficulty: 'intermediate',
    priority: 'low',
    completed: false,
    progress: 85,
    description: 'Build upper body strength',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    userId: 'user1'
  }
];

// Get all goals for a user
router.get('/', (req, res) => {
  const userId = req.query.userId || 'user1'; // In production, get from auth
  const userGoals = goals.filter(g => g.userId === userId);
  
  // Simulate API delay
  setTimeout(() => {
    res.json(userGoals);
  }, 500);
});

// Create a new goal
router.post('/', (req, res) => {
  try {
    const validatedData = GoalFormSchema.parse(req.body);
    const userId = req.query.userId || 'user1'; // In production, get from auth
    
    const newGoal = {
      id: crypto.randomUUID(),
      ...validatedData,
      current: 0,
      completed: false,
      progress: 0,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    goals.push(newGoal);
    
    return res.status(201).json(newGoal);
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

// Update a goal
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId || 'user1';
    const goalIndex = goals.findIndex(g => g.id === id && g.userId === userId);
    
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const validatedData = GoalFormSchema.partial().parse(req.body);
    
    goals[goalIndex] = {
      ...goals[goalIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    return res.json(goals[goalIndex]);
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

// Update goal progress
router.patch('/:id/progress', (req, res) => {
  try {
    const { id } = req.params;
    const { current } = req.body;
    const userId = req.query.userId || 'user1';
    const goalIndex = goals.findIndex(g => g.id === id && g.userId === userId);
    
    if (goalIndex === -1) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const goal = goals[goalIndex];
    const progress = Math.min((current / goal.target) * 100, 100);
    const completed = progress >= 100;
    
    goals[goalIndex] = {
      ...goal,
      current,
      progress,
      completed,
      updatedAt: new Date().toISOString()
    };
    
    return res.json(goals[goalIndex]);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a goal
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId || 'user1';
  const goalIndex = goals.findIndex(g => g.id === id && g.userId === userId);
  
  if (goalIndex === -1) {
    return res.status(404).json({ error: 'Goal not found' });
  }
  
  goals.splice(goalIndex, 1);
  return res.status(204).send();
});

export default router; 