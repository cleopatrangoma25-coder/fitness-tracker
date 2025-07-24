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

  it('should disable Previous button on first step', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    const previousButton = screen.getByText('Previous')
    expect(previousButton).toBeDisabled()
  })

  it('should call onComplete when Get Started is clicked on last step', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Navigate to last step
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton) // Step 2
    fireEvent.click(screen.getByText('Next')) // Step 3
    fireEvent.click(screen.getByText('Next')) // Step 4
    fireEvent.click(screen.getByText('Next')) // Step 5 (last step)
    
    const getStartedButton = screen.getByText('Get Started')
    fireEvent.click(getStartedButton)
    
    expect(defaultProps.onComplete).toHaveBeenCalledTimes(1)
  })

  it('should call onSkip when Skip button is clicked', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    const skipButton = screen.getByText('Skip')
    fireEvent.click(skipButton)
    
    expect(defaultProps.onSkip).toHaveBeenCalledTimes(1)
  })

  it('should show all onboarding steps with correct content', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Step 1: Welcome
    expect(screen.getAllByText('Welcome to Fitness Tracker!')[0]).toBeInTheDocument()
    expect(screen.getByText('Log Workouts')).toBeInTheDocument()
    expect(screen.getByText('Set Goals')).toBeInTheDocument()
    expect(screen.getByText('Track Progress')).toBeInTheDocument()
    
    // Navigate to step 2
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getAllByText('Log Your Workouts')[0]).toBeInTheDocument()
    expect(screen.getByText('Track exercises, sets, and reps')).toBeInTheDocument()
    
    // Navigate to step 3
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Set Fitness Goals')).toBeInTheDocument()
    expect(screen.getByText('Define your objectives and track progress')).toBeInTheDocument()
    
    // Navigate to step 4
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('Track Your Progress')).toBeInTheDocument()
    expect(screen.getByText('Visualize your fitness journey')).toBeInTheDocument()
    
    // Navigate to step 5
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText("You're All Set!")).toBeInTheDocument()
    expect(screen.getByText('Log your first workout')).toBeInTheDocument()
    expect(screen.getByText('Set a fitness goal')).toBeInTheDocument()
  })

  it('should show correct button text based on step', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // First step should show "Next"
    expect(screen.getByText('Next')).toBeInTheDocument()
    
    // Navigate to last step
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton) // Step 2
    fireEvent.click(screen.getByText('Next')) // Step 3
    fireEvent.click(screen.getByText('Next')) // Step 4
    fireEvent.click(screen.getByText('Next')) // Step 5 (last step)
    
    // Last step should show "Get Started"
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('should update progress bar correctly when navigating', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Step 1: 20%
    expect(screen.getByText('20%')).toBeInTheDocument()
    
    // Step 2: 40%
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('40%')).toBeInTheDocument()
    
    // Step 3: 60%
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('60%')).toBeInTheDocument()
    
    // Step 4: 80%
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('80%')).toBeInTheDocument()
    
    // Step 5: 100%
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<OnboardingFlow {...defaultProps} />)
    
    // Check for proper button roles
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    
    // Check for proper heading structure (use getAllByRole since there are multiple headings)
    expect(screen.getAllByRole('heading', { name: /welcome to fitness tracker!/i })[0]).toBeInTheDocument()
  })
}) 