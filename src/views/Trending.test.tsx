import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Trending from './Trending'
import trendingReducer from '../store/slices/trendingSlice'

// Create a mock scrollBy function that we can track
const mockScrollBy = vi.fn()

// Mock the Virtuoso component
vi.mock('react-virtuoso', () => ({
  Virtuoso: vi.fn().mockImplementation(({ data, itemContent, ref }) => {
    // Forward the ref to the mock element
    if (ref) {
      ref.current = {
        scrollBy: mockScrollBy
      }
    }
    return (
      <div data-testid="virtuoso-mock">
        {data.map((item: any, index: number) => (
          <div key={index}>{itemContent(index, item)}</div>
        ))}
      </div>
    )
  })
}))

// Mock the RateLimitErrorModal component
vi.mock('../components/Trending/RateLimitErrorModal', () => ({
  default: ({ timeLeft, onRetry }: any) => (
    <div data-testid="rate-limit-modal">
      <button onClick={onRetry}>Retry</button>
      {timeLeft && <span>Time left: {timeLeft}</span>}
    </div>
  )
}))

// Mock the TrendingItem component
vi.mock('../components/Trending/TrendingItem', () => ({
  default: ({ repo }: any) => (
    <div data-testid="trending-item">
      {repo.name}
    </div>
  )
}))

// Mock the Toast component
vi.mock('../components/Toast', () => ({
  default: ({ message, show }: { message: string; show: boolean }) => (
    show ? <div data-testid="toast">{message}</div> : null
  )
}))

describe('Trending Component', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        trending: trendingReducer
      }
    })
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    expect(screen.getByText('Loading trending repositories...')).toBeInTheDocument()
  })

  it('renders repositories when data is available', async () => {
    // Mock initial state with some repositories
    store = configureStore({
      reducer: {
        trending: trendingReducer
      },
      preloadedState: {
        trending: {
          allRepos: [
            { 
              id: 1, 
              name: 'repo1',
              full_name: 'owner/repo1',
              description: 'Test repo 1',
              stargazers_count: 100,
              language: 'JavaScript',
              html_url: 'https://github.com/owner/repo1',
              owner: {
                avatar_url: 'https://github.com/avatar1.jpg',
                login: 'owner1'
              }
            },
            { 
              id: 2, 
              name: 'repo2',
              full_name: 'owner/repo2',
              description: 'Test repo 2',
              stargazers_count: 200,
              language: 'TypeScript',
              html_url: 'https://github.com/owner/repo2',
              owner: {
                avatar_url: 'https://github.com/avatar2.jpg',
                login: 'owner2'
              }
            }
          ],
          currentPage: 1,
          lastAttemptedPage: 1,
          status: 'succeeded' as const,
          error: null,
          rateLimitResetTime: null
        }
      }
    })

    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('virtuoso-mock')).toBeInTheDocument()
      expect(screen.getAllByTestId('trending-item')).toHaveLength(2)
    })
  })

  it('shows rate limit error modal and disables repository list when error occurs', async () => {
    store = configureStore({
      reducer: {
        trending: trendingReducer
      },
      preloadedState: {
        trending: {
          allRepos: [
            { 
              id: 1, 
              name: 'repo1',
              full_name: 'owner/repo1',
              description: 'Test repo 1',
              stargazers_count: 100,
              language: 'JavaScript',
              html_url: 'https://github.com/owner/repo1',
              owner: {
                avatar_url: 'https://github.com/avatar1.jpg',
                login: 'owner1'
              }
            }
          ],
          currentPage: 1,
          lastAttemptedPage: 1,
          status: 'failed' as const,
          error: 'Rate limit exceeded',
          rateLimitResetTime: Date.now() + 30000
        }
      }
    })

    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    // Wait for the initial loading state to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading trending repositories...')).not.toBeInTheDocument()
    })

    // Check for the rate limit modal
    expect(screen.getByTestId('rate-limit-modal')).toBeInTheDocument()
    
    // Check that the repository list is present but disabled
    const mainContent = screen.getByTestId('virtuoso-mock').closest('.virtuoso-scroll-hide')
    expect(mainContent).toHaveClass('pointer-events-none')
  })

  it('shows loading more indicator when fetching additional data', () => {
    store = configureStore({
      reducer: {
        trending: trendingReducer
      },
      preloadedState: {
        trending: {
          allRepos: [{ 
            id: 1, 
            name: 'repo1',
            full_name: 'owner/repo1',
            description: 'Test repo 1',
            stargazers_count: 100,
            language: 'JavaScript',
            html_url: 'https://github.com/owner/repo1',
            owner: {
              avatar_url: 'https://github.com/avatar1.jpg',
              login: 'owner1'
            }
          }],
          currentPage: 1,
          lastAttemptedPage: 1,
          status: 'loading' as const,
          error: null,
          rateLimitResetTime: null
        }
      }
    })

    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    expect(screen.getByTestId('toast')).toHaveTextContent('Loading more repositories...')
  })

  it('does not show loading toast when there are no repositories', () => {
    store = configureStore({
      reducer: {
        trending: trendingReducer
      },
      preloadedState: {
        trending: {
          allRepos: [],
          currentPage: 1,
          lastAttemptedPage: 1,
          status: 'loading' as const,
          error: null,
          rateLimitResetTime: null
        }
      }
    })

    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    expect(screen.queryByTestId('toast')).not.toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    // Mock initial state with some repositories
    store = configureStore({
      reducer: {
        trending: trendingReducer
      },
      preloadedState: {
        trending: {
          allRepos: [
            { 
              id: 1, 
              name: 'repo1',
              full_name: 'owner/repo1',
              description: 'Test repo 1',
              stargazers_count: 100,
              language: 'JavaScript',
              html_url: 'https://github.com/owner/repo1',
              owner: {
                avatar_url: 'https://github.com/avatar1.jpg',
                login: 'owner1'
              }
            }
          ],
          currentPage: 1,
          lastAttemptedPage: 1,
          status: 'succeeded' as const,
          error: null,
          rateLimitResetTime: null
        }
      }
    })

    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByTestId('virtuoso-mock')).toBeInTheDocument()
    })

    // Test ArrowUp key
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    expect(mockScrollBy).toHaveBeenCalledWith({ top: -300, behavior: 'smooth' })

    // Test ArrowDown key
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    expect(mockScrollBy).toHaveBeenCalledWith({ top: 300, behavior: 'smooth' })

    // Test other key (should not trigger scroll)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(mockScrollBy).toHaveBeenCalledTimes(2) // Still only called twice for ArrowUp and ArrowDown
  })

  it('does not handle keyboard navigation when error is present', async () => {
    store = configureStore({
      reducer: {
        trending: trendingReducer
      },
      preloadedState: {
        trending: {
          allRepos: [
            { 
              id: 1, 
              name: 'repo1',
              full_name: 'owner/repo1',
              description: 'Test repo 1',
              stargazers_count: 100,
              language: 'JavaScript',
              html_url: 'https://github.com/owner/repo1',
              owner: {
                avatar_url: 'https://github.com/avatar1.jpg',
                login: 'owner1'
              }
            }
          ],
          currentPage: 1,
          lastAttemptedPage: 1,
          status: 'failed' as const,
          error: 'Rate limit exceeded',
          rateLimitResetTime: Date.now() + 30000
        }
      }
    })

    render(
      <Provider store={store}>
        <Trending />
      </Provider>
    )

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByTestId('rate-limit-modal')).toBeInTheDocument()
    })

    // Test ArrowUp key (should not trigger scroll)
    fireEvent.keyDown(window, { key: 'ArrowUp' })
    expect(mockScrollBy).not.toHaveBeenCalled()
  })
}) 