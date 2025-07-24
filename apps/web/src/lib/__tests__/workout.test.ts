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
          date: new Date('2024-01-01'),
          durationMinutes: 60,
        },
        {
          id: '2',
          date: new Date('2024-01-03'),
          durationMinutes: 45,
        },
      ]

      // Mock the Firestore response
      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: mockWorkouts.map(workout => ({
          id: workout.id,
          data: () => workout,
        })),
      })

      vi.mocked(require('firebase/firestore').getDocs).mockImplementation(mockGetDocs)

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
      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: [],
      })

      vi.mocked(require('firebase/firestore').getDocs).mockImplementation(mockGetDocs)

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
          exercises: [
            { muscleGroup: 'CHEST' },
            { muscleGroup: 'CHEST' },
            { muscleGroup: 'BACK' },
          ],
        },
        {
          exercises: [
            { muscleGroup: 'LEGS' },
            { muscleGroup: 'CHEST' },
          ],
        },
      ]

      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: mockWorkouts.map(workout => ({
          data: () => workout,
        })),
      })

      vi.mocked(require('firebase/firestore').getDocs).mockImplementation(mockGetDocs)

      const result = await WorkoutService.getMuscleGroupStats(mockUserId)

      expect(result).toEqual([
        {
          muscleGroup: 'CHEST',
          count: 3,
          percentage: 60,
        },
        {
          muscleGroup: 'BACK',
          count: 1,
          percentage: 20,
        },
        {
          muscleGroup: 'LEGS',
          count: 1,
          percentage: 20,
        },
      ])
    })
  })

  describe('getPersonalRecords', () => {
    it('should return personal records', async () => {
      const mockWorkouts = [
        {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
              ],
            },
          ],
        },
        {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 120, reps: 5 },
                { weight: 115, reps: 7 },
              ],
            },
          ],
        },
      ]

      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: mockWorkouts.map(workout => ({
          data: () => workout,
        })),
      })

      vi.mocked(require('firebase/firestore').getDocs).mockImplementation(mockGetDocs)

      const result = await WorkoutService.getPersonalRecords(mockUserId)

      expect(result).toEqual([
        {
          exerciseName: 'Bench Press',
          maxWeight: 120,
          maxReps: 8,
          maxVolume: 960, // 120 * 8
          lastAchieved: expect.any(Date),
        },
      ])
    })
  })
}) 