import { describe, it, expect } from 'vitest'

// Simple utility function for testing
export function add(a: number, b: number): number {
  return a + b
}

export function formatDate(date: Date): string {
  const parts = date.toISOString().split('T')
  return parts[0] || date.toISOString()
}

describe('Utility Functions', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(-1, 1)).toBe(0)
    expect(add(0, 0)).toBe(0)
  })

  it('should format date correctly', () => {
    const date = new Date('2025-01-21T10:30:00Z')
    expect(formatDate(date)).toBe('2025-01-21')
  })
}) 