import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => vi.restoreAllMocks())

it('renders the Brightcone People Plus suite dashboard', async () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <App />
    </QueryClientProvider>,
  )

  const elements = await screen.findAllByText(/Brightcone/i)
  expect(elements.length).toBeGreaterThan(0)
  expect(await screen.findByText(/Enterprise Suite/i)).toBeInTheDocument()
})
