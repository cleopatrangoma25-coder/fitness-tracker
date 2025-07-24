import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('should render with title', () => {
    render(<Button title="Click me" onClick={() => {}} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button title="Click me" onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn()
    render(<Button title="Click me" onClick={handleClick} disabled />)
    
    const button = screen.getByText('Click me')
    expect(button).toBeDisabled()
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button title="Primary" onClick={() => {}} variant="primary" />)
    expect(screen.getByText('Primary')).toHaveClass('bg-primary-500')

    rerender(<Button title="Secondary" onClick={() => {}} variant="secondary" />)
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary-500')

    rerender(<Button title="Outline" onClick={() => {}} variant="outline" />)
    expect(screen.getByText('Outline')).toHaveClass('border')

    rerender(<Button title="Ghost" onClick={() => {}} variant="ghost" />)
    expect(screen.getByText('Ghost')).toHaveClass('hover:bg-gray-100')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button title="Small" onClick={() => {}} size="small" />)
    expect(screen.getByText('Small')).toHaveClass('px-3 py-1.5 text-sm')

    rerender(<Button title="Medium" onClick={() => {}} size="medium" />)
    expect(screen.getByText('Medium')).toHaveClass('px-4 py-2')

    rerender(<Button title="Large" onClick={() => {}} size="large" />)
    expect(screen.getByText('Large')).toHaveClass('px-6 py-3 text-lg')
  })

  it('should render with custom className', () => {
    render(<Button title="Custom" onClick={() => {}} className="custom-class" />)
    expect(screen.getByText('Custom')).toHaveClass('custom-class')
  })

  it('should render with type attribute', () => {
    render(<Button title="Submit" onClick={() => {}} type="submit" />)
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')
  })
}) 