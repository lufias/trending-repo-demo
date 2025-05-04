import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from './Layout'

// Mock FontAwesomeIcon to avoid issues with icon rendering
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: any }) => <div data-testid="mock-icon">{icon.iconName}</div>
}))

describe('Layout Component', () => {
  const renderWithRouter = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Layout />
      </MemoryRouter>
    )
  }

  it('renders the header with correct title', () => {
    renderWithRouter()
    const header = screen.getByRole('heading', { name: /trending repos/i })
    expect(header).toBeInTheDocument()
  })

  it('renders the main content area', () => {
    renderWithRouter()
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('renders the bottom navigation', () => {
    renderWithRouter()
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('applies active styling to the current route in navigation', () => {
    renderWithRouter('/')
    const activeLink = screen.getByRole('link', { name: /trending/i })
    expect(activeLink).toHaveClass('text-blue-500')
  })

  it('renders the Suspense fallback when content is loading', () => {
    renderWithRouter()
    const loadingSpinner = screen.getByRole('main').querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
  })
}) 
