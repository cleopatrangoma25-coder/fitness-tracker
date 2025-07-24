import React from 'react'
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../components/auth/AuthProvider'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render } 