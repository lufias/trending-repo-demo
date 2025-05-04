import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import TrendingItem from './TrendingItem'
import settingsReducer from '../../store/slices/settingsSlice'

// Mock store with default settings
const createMockStore = (settings = {
  trendingItem: {
    showAvatar: true,
    showTags: true,
    showDescription: true,
    showStars: true,
  }
}) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings,
    },
  })
}

describe('TrendingItem Component', () => {
  const mockRepo = {
    owner: {
      avatar_url: 'https://example.com/avatar.jpg',
      login: 'testuser'
    },
    html_url: 'https://example.com/repo',
    full_name: 'testuser/repo',
    description: 'Test repository description',
    stargazers_count: 100,
    topics: ['react', 'typescript', 'testing']
  }

  it('renders repository information correctly', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <TrendingItem repo={mockRepo} />
      </Provider>
    )

    expect(screen.getByText(mockRepo.full_name)).toBeInTheDocument()
    expect(screen.getByText(mockRepo.description)).toBeInTheDocument()
    expect(screen.getByText(mockRepo.owner.login)).toBeInTheDocument()
    expect(screen.getByText(mockRepo.stargazers_count.toLocaleString())).toBeInTheDocument()
    expect(screen.getByAltText(mockRepo.owner.login)).toHaveAttribute('src', mockRepo.owner.avatar_url)
  })

  it('renders topics correctly', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <TrendingItem repo={mockRepo} />
      </Provider>
    )

    mockRepo.topics?.forEach(topic => {
      expect(screen.getByText(topic)).toBeInTheDocument()
    })
  })

  it('handles missing description', () => {
    const store = createMockStore()
    const repoWithoutDesc = { ...mockRepo, description: null }
    render(
      <Provider store={store}>
        <TrendingItem repo={repoWithoutDesc} />
      </Provider>
    )

    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('handles missing topics', () => {
    const store = createMockStore()
    const repoWithoutTopics = { ...mockRepo, topics: undefined }
    render(
      <Provider store={store}>
        <TrendingItem repo={repoWithoutTopics} />
      </Provider>
    )

    mockRepo.topics?.forEach(topic => {
      expect(screen.queryByText(topic)).not.toBeInTheDocument()
    })
  })

  it('applies lastRepoElementRef when provided', () => {
    const store = createMockStore()
    const mockRef = vi.fn()
    render(
      <Provider store={store}>
        <TrendingItem repo={mockRepo} lastRepoElementRef={mockRef} />
      </Provider>
    )

    // The ref should be called with the root div element
    expect(mockRef).toHaveBeenCalled()
  })

  it('does not apply lastRepoElementRef when not provided', () => {
    const store = createMockStore()
    const mockRef = vi.fn()
    render(
      <Provider store={store}>
        <TrendingItem repo={mockRepo} />
      </Provider>
    )

    expect(mockRef).not.toHaveBeenCalled()
  })

  it('respects visibility settings', () => {
    const store = createMockStore({
      trendingItem: {
        showAvatar: false,
        showTags: false,
        showDescription: false,
        showStars: false,
      }
    })
    render(
      <Provider store={store}>
        <TrendingItem repo={mockRepo} />
      </Provider>
    )

    // Only the title should be visible
    expect(screen.getByText(mockRepo.full_name)).toBeInTheDocument()
    expect(screen.queryByText(mockRepo.description)).not.toBeInTheDocument()
    expect(screen.queryByText(mockRepo.owner.login)).not.toBeInTheDocument()
    expect(screen.queryByText(mockRepo.stargazers_count.toLocaleString())).not.toBeInTheDocument()
    expect(screen.queryByAltText(mockRepo.owner.login)).not.toBeInTheDocument()
    mockRepo.topics?.forEach(topic => {
      expect(screen.queryByText(topic)).not.toBeInTheDocument()
    })
  })
}) 