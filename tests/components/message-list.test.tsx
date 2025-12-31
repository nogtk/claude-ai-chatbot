import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageList } from '@/src/components/chat/message-list'
import { ChakraProvider } from '@chakra-ui/react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })

describe('MessageList', () => {
  it('should show empty state when no messages', () => {
    customRender(<MessageList messages={[]} />)
    expect(
      screen.getByText(/メッセージはまだありません/)
    ).toBeInTheDocument()
  })

  it('should render all messages', () => {
    const messages = [
      { role: 'user' as const, content: 'Hello' },
      { role: 'assistant' as const, content: 'Hi there!' },
      { role: 'user' as const, content: 'How are you?' },
    ]

    customRender(<MessageList messages={messages} />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
    expect(screen.getByText('How are you?')).toBeInTheDocument()
  })

  it('should render messages in correct order', () => {
    const messages = [
      { role: 'user' as const, content: 'First' },
      { role: 'assistant' as const, content: 'Second' },
      { role: 'user' as const, content: 'Third' },
    ]

    const { container } = customRender(<MessageList messages={messages} />)

    const messageElements = container.querySelectorAll('[role="region"]')
    expect(messageElements.length).toBeGreaterThanOrEqual(3)
  })

  it('should handle single message', () => {
    const messages = [{ role: 'user' as const, content: 'Single message' }]

    customRender(<MessageList messages={messages} />)
    expect(screen.getByText('Single message')).toBeInTheDocument()
  })
})
