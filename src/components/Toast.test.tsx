import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import Toast from './Toast'

describe('Toast Component', () => {
  it('renders nothing when show is false', () => {
    render(<Toast message="Test message" show={false} />)
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('renders message when show is true', () => {
    render(<Toast message="Test message" show={true} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<Toast message="Test message" show={true} />)
    const toast = screen.getByText('Test message').closest('div')
    expect(toast).toHaveClass('bg-blue-500/90')
    expect(toast).toHaveClass('border-blue-400/50')
  })

  it('applies success variant styles', () => {
    render(<Toast message="Test message" show={true} variant="success" />)
    const toast = screen.getByText('Test message').closest('div')
    expect(toast).toHaveClass('bg-green-500/90')
    expect(toast).toHaveClass('border-green-400/50')
  })

  it('applies error variant styles', () => {
    render(<Toast message="Test message" show={true} variant="error" />)
    const toast = screen.getByText('Test message').closest('div')
    expect(toast).toHaveClass('bg-red-500/90')
    expect(toast).toHaveClass('border-red-400/50')
  })

  it('applies warning variant styles', () => {
    render(<Toast message="Test message" show={true} variant="warning" />)
    const toast = screen.getByText('Test message').closest('div')
    expect(toast).toHaveClass('bg-yellow-500/90')
    expect(toast).toHaveClass('border-yellow-400/50')
  })

  it('positions toast at bottom by default', () => {
    render(<Toast message="Test message" show={true} />)
    const container = screen.getByText('Test message').closest('div')?.parentElement
    expect(container).toHaveClass('bottom-24')
  })

  it('positions toast at top when specified', () => {
    render(<Toast message="Test message" show={true} position="top" />)
    const container = screen.getByText('Test message').closest('div')?.parentElement
    expect(container).toHaveClass('top-24')
  })

  it('applies custom offset', () => {
    render(<Toast message="Test message" show={true} offset={16} />)
    const container = screen.getByText('Test message').closest('div')?.parentElement
    expect(container).toHaveClass('bottom-16')
  })

  it('auto-hides after duration', () => {
    vi.useFakeTimers()
    render(<Toast message="Test message" show={true} duration={1000} />)
    
    // Initially visible
    expect(screen.getByText('Test message')).toBeInTheDocument()
    
    // Advance timers by duration
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Should be hidden
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('cleans up timer on unmount', () => {
    vi.useFakeTimers()
    const { unmount } = render(<Toast message="Test message" show={true} duration={1000} />)
    
    // Spy on clearTimeout
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    
    // Unmount component
    unmount()
    
    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled()
    
    vi.useRealTimers()
  })
}) 