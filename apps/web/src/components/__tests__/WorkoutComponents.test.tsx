import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ActiveWorkout } from '../workout/ActiveWorkout'
import { WorkoutTemplates } from '../workout/WorkoutTemplates'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock Firebase Auth and Workout Service
vi.mock('../../lib/auth', () => ({
  AuthService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => () => {}),
    getUserProfile: vi.fn(),
  }
}))

vi.mock('../../lib/workout', () => ({
  WorkoutService: {
    getExercises: vi.fn(),
    createWorkout: vi.fn(),
    getUserWorkouts: vi.fn(),
  }
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Workout Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ActiveWorkout', () => {
    it('should render workout creation interface', async () => {
      const { WorkoutService } = await import('../../lib/workout')
      vi.mocked(WorkoutService.getExercises).mockResolvedValue([
        {
          id: '1',
          name: 'Push-ups',
          muscleGroup: 'CHEST',
          equipment: [],
          instructions: 'Start in plank position',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Pull-ups',
          muscleGroup: 'BACK',
          equipment: ['Pull-up bar'],
          instructions: 'Hang from bar',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Squats',
          muscleGroup: 'LEGS',
          equipment: [],
          instructions: 'Stand with feet shoulder-width, lower as if sitting back',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      renderWithRouter(<ActiveWorkout />)
      
      await waitFor(() => {
        expect(screen.getByText(/start new workout/i)).toBeInTheDocument()
        expect(screen.getByText(/filter by muscle group/i)).toBeInTheDocument()
        expect(screen.getAllByText(/available exercises/i)).toHaveLength(2)
      })
    })

    it('should filter exercises by muscle group', async () => {
      const { WorkoutService } = await import('../../lib/workout')
      vi.mocked(WorkoutService.getExercises).mockResolvedValue([
        {
          id: '1',
          name: 'Push-ups',
          muscleGroup: 'CHEST',
          equipment: [],
          instructions: 'Start in plank position',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Pull-ups',
          muscleGroup: 'BACK',
          equipment: ['Pull-up bar'],
          instructions: 'Hang from bar',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      renderWithRouter(<ActiveWorkout />)
      
      await waitFor(() => {
        expect(screen.getByText('Push-ups')).toBeInTheDocument()
        expect(screen.getByText('Pull-ups')).toBeInTheDocument()
      })

      // Click on Chest filter
      const chestFilter = screen.getByText('Chest')
      fireEvent.click(chestFilter)

      await waitFor(() => {
        expect(screen.getByText('Push-ups')).toBeInTheDocument()
        expect(screen.queryByText('Pull-ups')).not.toBeInTheDocument()
      })
    })

    it('should allow selecting exercises', async () => {
      const { WorkoutService } = await import('../../lib/workout')
      vi.mocked(WorkoutService.getExercises).mockResolvedValue([
        {
          id: '1',
          name: 'Push-ups',
          muscleGroup: 'CHEST',
          equipment: [],
          instructions: 'Start in plank position',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      renderWithRouter(<ActiveWorkout />)
      
      await waitFor(() => {
        const exerciseCard = screen.getByText('Push-ups').closest('div')
        expect(exerciseCard).toBeInTheDocument()
      })

      const exerciseCard = screen.getByText('Push-ups').closest('div')
      fireEvent.click(exerciseCard!)

      await waitFor(() => {
        expect(screen.getByText('1 exercises')).toBeInTheDocument()
      })
    })

    it('should show workout templates', async () => {
      const { WorkoutService } = await import('../../lib/workout')
      vi.mocked(WorkoutService.getExercises).mockResolvedValue([
        {
          id: '1',
          name: 'Push-ups',
          muscleGroup: 'CHEST',
          equipment: [],
          instructions: 'Start in plank position',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ])

      renderWithRouter(<ActiveWorkout />)
      
      await waitFor(() => {
        expect(screen.getByText(/start new workout/i)).toBeInTheDocument()
      })

      // Look for the "Use Template" button
      const templatesButton = screen.getByText(/use template/i)
      fireEvent.click(templatesButton)

      await waitFor(() => {
        expect(screen.getByText(/Quick 15-Minute/i)).toBeInTheDocument()
        expect(screen.getByText(/Express 20-Minute/i)).toBeInTheDocument()
      })
    })
  })

  describe('WorkoutTemplates', () => {
    const mockExercises = [
      {
        id: '1',
        name: 'Push-ups',
        muscleGroup: 'CHEST' as const,
        equipment: [] as string[],
        instructions: 'Start in plank position',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    it('should render workout templates', () => {
      const mockOnSelect = vi.fn()
      
      render(
        <WorkoutTemplates onSelectTemplate={mockOnSelect} availableExercises={mockExercises} />
      )
      
      expect(screen.getByText(/Quick 15-Minute/i)).toBeInTheDocument()
      expect(screen.getByText(/Express 20-Minute/i)).toBeInTheDocument()
      expect(screen.getByText(/Full Body/i)).toBeInTheDocument()
    })

    it('should call onSelectTemplate when template is clicked', () => {
      const mockOnSelect = vi.fn()
      
      render(
        <WorkoutTemplates onSelectTemplate={mockOnSelect} availableExercises={mockExercises} />
      )
      
      const template = screen.getByText(/Quick 15-Minute/i).closest('div')
      fireEvent.click(template!)

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'quick-15',
          name: 'Quick 15-Minute'
        })
      )
    })

    it('should show template details', () => {
      const mockOnSelect = vi.fn()
      
      render(
        <WorkoutTemplates onSelectTemplate={mockOnSelect} availableExercises={mockExercises} />
      )
      
      // Check for duration badges
      const durationElements = screen.getAllByText(/min/i)
      expect(durationElements.length).toBeGreaterThan(0)
      
      // Check for difficulty badges
      expect(screen.getAllByText(/Beginner/i)[0]).toBeInTheDocument()
      expect(screen.getAllByText(/Intermediate/i)[0]).toBeInTheDocument()
    })

    it('should show hero section', () => {
      const mockOnSelect = vi.fn()
      
      render(
        <WorkoutTemplates onSelectTemplate={mockOnSelect} availableExercises={mockExercises} />
      )
      
      expect(screen.getByText(/Ready to Transform Your Fitness/i)).toBeInTheDocument()
      expect(screen.getByText(/Choose your perfect workout template/i)).toBeInTheDocument()
    })

    it('should show quick workouts section', () => {
      const mockOnSelect = vi.fn()
      
      render(
        <WorkoutTemplates onSelectTemplate={mockOnSelect} availableExercises={mockExercises} />
      )
      
      expect(screen.getAllByText(/Quick Workouts/i)[0]).toBeInTheDocument()
      expect(screen.getByText(/Perfect for busy schedules/i)).toBeInTheDocument()
    })

    it('should show standard workouts section', () => {
      const mockOnSelect = vi.fn()
      
      render(
        <WorkoutTemplates onSelectTemplate={mockOnSelect} availableExercises={mockExercises} />
      )
      
      expect(screen.getByText(/Standard Workouts/i)).toBeInTheDocument()
      expect(screen.getByText(/Complete training sessions/i)).toBeInTheDocument()
    })
  })
}) 