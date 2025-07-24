import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WorkoutService } from '../workout'

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
}))

describe('WorkoutService', () => {
  const mockUserId = 'test-user-id'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getWorkoutStats', () => {
    it('should return workout statistics', async () => {
      const mockWorkouts = [
        {
          id: '1',
          name: 'Workout 1',
          date: new Date('2024-01-01'),
          exercises: [
            { 
              name: 'Push-ups', 
              sets: [
                { weight: 0, reps: 10, completed: true },
                { weight: 0, reps: 12, completed: true },
                { weight: 0, reps: 8, completed: true }
              ]
            },
            { 
              name: 'Squats', 
              sets: [
                { weight: 0, reps: 15, completed: true },
                { weight: 0, reps: 15, completed: true },
                { weight: 0, reps: 15, completed: true }
              ]
            },
          ],
        },
        {
          id: '2',
          name: 'Workout 2',
          date: new Date('2024-01-02'),
          exercises: [
            { 
              name: 'Pull-ups', 
              sets: [
                { weight: 0, reps: 8, completed: true },
                { weight: 0, reps: 6, completed: true },
                { weight: 0, reps: 5, completed: true }
              ]
            },
            { 
              name: 'Deadlifts', 
              sets: [
                { weight: 100, reps: 5, completed: true },
                { weight: 100, reps: 5, completed: true },
                { weight: 100, reps: 5, completed: true }
              ]
            },
          ],
        },
      ]

      // Mock the getUserWorkouts method directly
      vi.spyOn(WorkoutService, 'getUserWorkouts').mockResolvedValue(mockWorkouts as any)

      const result = await WorkoutService.getWorkoutStats(mockUserId)

      expect(result).toEqual({
        totalWorkouts: 2,
        thisWeek: expect.any(Number),
        thisMonth: expect.any(Number),
        lastWorkout: expect.any(Date),
        averageWorkoutsPerWeek: expect.any(Number),
        longestStreak: expect.any(Number),
        currentStreak: expect.any(Number),
      })
    })

    it('should handle empty workout list', async () => {
      // Mock the getUserWorkouts method to return empty array
      vi.spyOn(WorkoutService, 'getUserWorkouts').mockResolvedValue([])

      const result = await WorkoutService.getWorkoutStats(mockUserId)

      expect(result).toEqual({
        totalWorkouts: 0,
        thisWeek: 0,
        thisMonth: 0,
        lastWorkout: null,
        averageWorkoutsPerWeek: 0,
        longestStreak: 0,
        currentStreak: 0,
      })
    })
  })

  describe('getMuscleGroupStats', () => {
    it('should return muscle group statistics', async () => {
      const mockWorkouts = [
        {
          id: '1',
          exercises: [
            { name: 'Push-ups', sets: [] },
            { name: 'Squats', sets: [] },
          ],
        },
        {
          id: '2',
          exercises: [
            { name: 'Pull-ups', sets: [] },
            { name: 'Deadlifts', sets: [] },
          ],
        },
      ]

      // Mock the getUserWorkouts method
      vi.spyOn(WorkoutService, 'getUserWorkouts').mockResolvedValue(mockWorkouts as any)

      const result = await WorkoutService.getMuscleGroupStats(mockUserId)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          muscleGroup: expect.any(String),
          count: expect.any(Number),
          percentage: expect.any(Number),
        })
      ]))
    })
  })

  describe('getPersonalRecords', () => {
    it('should return personal records', async () => {
      const mockWorkouts = [
        {
          id: '1',
          date: new Date('2024-01-01'),
          exercises: [
            { 
              name: 'Bench Press', 
              sets: [
                { weight: 100, reps: 8, completed: true },
                { weight: 110, reps: 6, completed: true }
              ]
            },
            { 
              name: 'Squat', 
              sets: [
                { weight: 150, reps: 5, completed: true },
                { weight: 150, reps: 5, completed: true }
              ]
            },
          ],
        },
        {
          id: '2',
          date: new Date('2024-01-02'),
          exercises: [
            { 
              name: 'Bench Press', 
              sets: [
                { weight: 120, reps: 5, completed: true },
                { weight: 115, reps: 7, completed: true }
              ]
            },
            { 
              name: 'Deadlift', 
              sets: [
                { weight: 200, reps: 3, completed: true },
                { weight: 200, reps: 3, completed: true }
              ]
            },
          ],
        },
      ]

      // Mock the getUserWorkouts method
      vi.spyOn(WorkoutService, 'getUserWorkouts').mockResolvedValue(mockWorkouts as any)

      const result = await WorkoutService.getPersonalRecords(mockUserId)

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          exerciseName: expect.any(String),
          maxWeight: expect.any(Number),
          maxReps: expect.any(Number),
          maxVolume: expect.any(Number),
          lastAchieved: expect.any(Date),
        })
      ]))
    })
  })
}) 