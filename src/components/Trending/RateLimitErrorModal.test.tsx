import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RateLimitErrorModal from './RateLimitErrorModal'

describe('RateLimitErrorModal Component', () => {
  const mockOnRetry = vi.fn()

  it('renders the modal with correct title and message', () => {
    render(<RateLimitErrorModal timeLeft={null} onRetry={mockOnRetry} />)
    
    expect(screen.getByText('Whoa, Slow Down! 🚦')).toBeInTheDocument()
    expect(screen.getByText(/Looks like we're getting a bit too excited!/)).toBeInTheDocument()
  })

  it('shows time left when provided', () => {
    render(<RateLimitErrorModal timeLeft={30} onRetry={mockOnRetry} />)
    
    expect(screen.getByText(/We can continue exploring in 30 seconds/)).toBeInTheDocument()
  })

  it('does not show time left when not provided', () => {
    render(<RateLimitErrorModal timeLeft={null} onRetry={mockOnRetry} />)
    
    expect(screen.queryByText(/We can continue exploring in/)).not.toBeInTheDocument()
  })

  it('renders retry button with correct text when no time left', () => {
    render(<RateLimitErrorModal timeLeft={null} onRetry={mockOnRetry} />)
    
    const retryButton = screen.getByRole('button')
    expect(retryButton).toHaveTextContent("Let's continue!")
    expect(retryButton).not.toBeDisabled()
  })

  it('renders disabled retry button with correct text when time left', () => {
    render(<RateLimitErrorModal timeLeft={30} onRetry={mockOnRetry} />)
    
    const retryButton = screen.getByRole('button')
    expect(retryButton).toHaveTextContent('Taking a breather...')
    expect(retryButton).toBeDisabled()
  })

  it('calls onRetry when button is clicked and no time left', () => {
    render(<RateLimitErrorModal timeLeft={null} onRetry={mockOnRetry} />)
    
    const retryButton = screen.getByRole('button')
    fireEvent.click(retryButton)
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('does not call onRetry when button is clicked and time left', () => {
    render(<RateLimitErrorModal timeLeft={30} onRetry={mockOnRetry} />)
    
    const retryButton = screen.getByRole('button')
    fireEvent.click(retryButton)
    
    mockOnRetry.mockReset()
    
    expect(mockOnRetry).not.toHaveBeenCalled()
  })
}) 