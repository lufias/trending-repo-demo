import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Trending from './Trending'
import trendingReducer from '../store/slices/trendingSlice'

// Mock the Virtuoso component
vi.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent }: any) => (
    <div data-testid="virtuoso-mock">
      {data.map((item: any, index: number) => (
        <div key={index}>{itemContent(index, item)}</div>
      ))}
    </div>
  )
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

describe('Trending Component', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        trending: trendingReducer
      }
    })
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

    expect(screen.getByText('Loading more repositories...')).toBeInTheDocument()
  })
}) 