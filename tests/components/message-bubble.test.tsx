import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from '@/src/components/chat/message-bubble'
import { ChakraProvider } from '@chakra-ui/react'

// Wrapper component for Chakra UI
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })

describe('MessageBubble', () => {
  it('should render user message with blue background', () => {
    customRender(<MessageBubble role="user" content="Hello" />)
    const bubble = screen.getByText('Hello').closest('div')
    expect(bubble).toBeInTheDocument()
  })

  it('should render assistant message with gray background', () => {
    customRender(<MessageBubble role="assistant" content="Hi there!" />)
    const bubble = screen.getByText('Hi there!').closest('div')
    expect(bubble).toBeInTheDocument()
  })

  it('should display markdown content', () => {
    customRender(
      <MessageBubble role="assistant" content="This is **bold** text" />
    )
    expect(screen.getByText(/This is/)).toBeInTheDocument()
  })

  it('should handle multi-line content', () => {
    const multilineContent = 'Line 1\nLine 2\nLine 3'
    customRender(<MessageBubble role="user" content={multilineContent} />)
    expect(screen.getByText(/Line 1/)).toBeInTheDocument()
  })
})
