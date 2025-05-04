import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TrendingItem from './TrendingItem'

// Mock FontAwesomeIcon to avoid issues with icon rendering
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }: { icon: any }) => <div data-testid="mock-icon">{icon.iconName}</div>
}))

describe('TrendingItem Component', () => {
  const mockRepo = {
    owner: {
      avatar_url: 'https://example.com/avatar.jpg',
      login: 'testuser'
    },
    html_url: 'https://github.com/testuser/repo',
    full_name: 'testuser/repo',
    description: 'A test repository',
    stargazers_count: 1234,
    topics: ['javascript', 'react', 'typescript']
  }

  it('renders repository information correctly', () => {
    render(<TrendingItem repo={mockRepo} />)
    
    // Check repository name and link
    const repoLink = screen.getByRole('link', { name: mockRepo.full_name })
    expect(repoLink).toBeInTheDocument()
    expect(repoLink).toHaveAttribute('href', mockRepo.html_url)
    expect(repoLink).toHaveAttribute('target', '_blank')
    expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    // Check description
    expect(screen.getByText(mockRepo.description)).toBeInTheDocument()
    
    // Check star count
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByTestId('mock-icon')).toHaveTextContent('star')
    
    // Check avatar
    const avatar = screen.getByRole('img', { name: mockRepo.owner.login })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', mockRepo.owner.avatar_url)
  })

  it('renders topics correctly', () => {
    render(<TrendingItem repo={mockRepo} />)
    
    mockRepo.topics?.forEach(topic => {
      expect(screen.getByText(topic)).toBeInTheDocument()
    })
  })

  it('handles missing description', () => {
    const repoWithoutDescription = {
      ...mockRepo,
      description: null
    }
    
    render(<TrendingItem repo={repoWithoutDescription} />)
    
    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('handles missing topics', () => {
    const repoWithoutTopics = {
      ...mockRepo,
      topics: undefined
    }
    
    render(<TrendingItem repo={repoWithoutTopics} />)
    
    // No topics should be rendered
    expect(screen.queryByTestId('topic')).not.toBeInTheDocument()
  })

  it('applies lastRepoElementRef when provided', () => {
    const mockRef = vi.fn()
    render(<TrendingItem repo={mockRepo} lastRepoElementRef={mockRef} />)
    
    // The ref should be called with the root div element
    expect(mockRef).toHaveBeenCalled()
  })

  it('does not apply lastRepoElementRef when not provided', () => {
    render(<TrendingItem repo={mockRepo} />)
    
    // The component should still render without errors
    expect(screen.getByRole('link', { name: mockRepo.full_name })).toBeInTheDocument()
  })
}) 