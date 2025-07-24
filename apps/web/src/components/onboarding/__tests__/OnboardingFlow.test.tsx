import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingFlow } from '../OnboardingFlow'

describe('OnboardingFlow', () => {
  const defaultProps = {
    isOpen: true,
    onComplete: vi.fn(),
    onSkip: vi.fn(),
  }

  it('should not render when isOpen is false', () => {
    render(<OnboardingFlow {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Welcome to Fitness Tracker!')).not.toBeInTheDocument()
  })

  it('should render welcome step by default', () => {
    render(<OnboardingFlow {...defaultProps} />)
    expect(screen.getAllByText('Welcome to Fitness Tracker!')[0]).toBeInTheDocument()
    expect(screen.getByText('Your personal fitness journey starts here')).toBeInTheDocument()
  })

  it('should show progress bar with correct progress', () => {
    render(<OnboardingFlow {...defaultProps} />)
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('should navigate to next step when Next button is clicked', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(screen.getAllByText('Log Your Workouts')[0]).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
  })

  it('should navigate to previous step when Previous button is clicked', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Go to step 2
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    // Go back to step 1
    const previousButton = screen.getByText('Previous')
    fireEvent.click(previousButton)
    
    expect(screen.getAllByText('Welcome to Fitness Tracker!')[0]).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
  })

  it('should show all onboarding steps with correct content', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Step 1: Welcome
    expect(screen.getAllByText('Welcome to Fitness Tracker!')[0]).toBeInTheDocument()
    expect(screen.getByText('Your personal fitness journey starts here')).toBeInTheDocument()
    
    // Navigate to step 2
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getAllByText('Log Your Workouts')[0]).toBeInTheDocument()
    expect(screen.getByText('Track exercises, sets, and reps')).toBeInTheDocument()
    
    // Navigate to step 3
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getAllByText('Set Fitness Goals')[0]).toBeInTheDocument()
    expect(screen.getByText('Define your objectives and track progress')).toBeInTheDocument()
    
    // Navigate to step 4
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getAllByText('Track Your Progress')[0]).toBeInTheDocument()
    expect(screen.getByText('Visualize your fitness journey')).toBeInTheDocument()
    
    // Navigate to step 5
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getAllByText('You\'re All Set!')[0]).toBeInTheDocument()
    expect(screen.getByText('Ready to start your fitness journey')).toBeInTheDocument()
  })

  it('should call onComplete when Finish button is clicked', () => {
    const onComplete = vi.fn()
    render(<OnboardingFlow {...defaultProps} onComplete={onComplete} />)
    
    // Navigate to the last step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText('Next'))
    }
    
    fireEvent.click(screen.getByText('Get Started'))
    expect(onComplete).toHaveBeenCalled()
  })

  it('should call onSkip when Skip button is clicked', () => {
    const onSkip = vi.fn()
    render(<OnboardingFlow {...defaultProps} onSkip={onSkip} />)
    
    fireEvent.click(screen.getByText('Skip'))
    expect(onSkip).toHaveBeenCalled()
  })

  it('should show correct step numbers', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Step 1
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
    
    // Step 2
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
    
    // Step 3
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Step 3 of 5')).toBeInTheDocument()
    
    // Step 4
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Step 4 of 5')).toBeInTheDocument()
    
    // Step 5
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Step 5 of 5')).toBeInTheDocument()
  })
}) 