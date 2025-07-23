import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('renders with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    )
    const card = screen.getByText('Content').parentElement
    expect(card).toHaveClass('custom-class')
  })

  it('renders with different variants', () => {
    const { rerender } = render(
      <Card variant="default">
        <div>Default card</div>
      </Card>
    )
    expect(screen.getByText('Default card')).toBeInTheDocument()

    rerender(
      <Card variant="outlined">
        <div>Outlined card</div>
      </Card>
    )
    expect(screen.getByText('Outlined card')).toBeInTheDocument()
  })

  it('renders with header and footer', () => {
    render(
      <Card>
        <Card.Header>
          <h2>Card Title</h2>
        </Card.Header>
        <Card.Content>
          <p>Card content</p>
        </Card.Content>
        <Card.Footer>
          <button>Action</button>
        </Card.Footer>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('applies padding classes correctly', () => {
    render(
      <Card padding="none">
        <div>No padding</div>
      </Card>
    )
    const card = screen.getByText('No padding').parentElement
    expect(card).toHaveClass('p-0')
  })
}) 