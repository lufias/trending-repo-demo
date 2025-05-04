import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import Settings from './Settings'
import settingsReducer from '../store/slices/settingsSlice'

describe('Settings Component', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        settings: settingsReducer
      },
      preloadedState: {
        settings: {
          trendingItem: {
            showAvatar: false,
            showTags: false,
            showDescription: false,
            showStars: false
          }
        }
      }
    })
  })

  it('renders all settings toggles', () => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Avatar')).toBeInTheDocument()
    expect(screen.getByText('Tags')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Stars')).toBeInTheDocument()
  })

  it('has title toggle disabled by default', () => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    const titleToggle = screen.getByRole('button', { name: /title/i })
    expect(titleToggle).toHaveClass('cursor-not-allowed')
    expect(titleToggle).toBeDisabled()
  })

  it('toggles avatar visibility when clicked', async () => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    const avatarToggle = screen.getByRole('button', { name: /avatar/i })
    fireEvent.click(avatarToggle)

    // Wait for the state change to be reflected
    await waitFor(() => {
      expect(avatarToggle).toHaveClass('bg-blue-600')
    })
  })

  it('toggles tags visibility when clicked', async () => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    const tagsToggle = screen.getByRole('button', { name: /tags/i })
    fireEvent.click(tagsToggle)

    // Wait for the state change to be reflected
    await waitFor(() => {
      expect(tagsToggle).toHaveClass('bg-blue-600')
    })
  })

  it('toggles description visibility when clicked', async () => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    const descriptionToggle = screen.getByRole('button', { name: /description/i })
    fireEvent.click(descriptionToggle)

    // Wait for the state change to be reflected
    await waitFor(() => {
      expect(descriptionToggle).toHaveClass('bg-blue-600')
    })
  })

  it('toggles stars visibility when clicked', async () => {
    render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    const starsToggle = screen.getByRole('button', { name: /stars/i })
    fireEvent.click(starsToggle)

    // Wait for the state change to be reflected
    await waitFor(() => {
      expect(starsToggle).toHaveClass('bg-blue-600')
    })
  })

  it('persists toggle states between renders', async () => {
    const { rerender } = render(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    // Toggle some settings
    const avatarToggle = screen.getByRole('button', { name: /avatar/i })
    const tagsToggle = screen.getByRole('button', { name: /tags/i })
    fireEvent.click(avatarToggle)
    fireEvent.click(tagsToggle)

    // Wait for the state changes to be reflected
    await waitFor(() => {
      expect(avatarToggle).toHaveClass('bg-blue-600')
      expect(tagsToggle).toHaveClass('bg-blue-600')
    })

    // Rerender the component
    rerender(
      <Provider store={store}>
        <Settings />
      </Provider>
    )

    // Check if the states persisted
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /avatar/i })).toHaveClass('bg-blue-600')
      expect(screen.getByRole('button', { name: /tags/i })).toHaveClass('bg-blue-600')
    })
  })
}) 