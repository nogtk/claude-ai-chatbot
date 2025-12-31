import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatInput } from '@/src/components/chat/chat-input'
import { ChakraProvider } from '@chakra-ui/react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options })

describe('ChatInput', () => {
  it('should render input field and send button', () => {
    const mockOnSend = vi.fn()
    customRender(<ChatInput onSendMessage={mockOnSend} isLoading={false} />)

    expect(screen.getByPlaceholderText(/メッセージを入力/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /送信/ })).toBeInTheDocument()
  })

  it('should call onSendMessage when form is submitted', () => {
    const mockOnSend = vi.fn()
    customRender(<ChatInput onSendMessage={mockOnSend} isLoading={false} />)

    const input = screen.getByPlaceholderText(/メッセージを入力/)
    const button = screen.getByRole('button', { name: /送信/ })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(button)

    expect(mockOnSend).toHaveBeenCalledWith('Hello')
  })

  it('should clear input after sending', () => {
    const mockOnSend = vi.fn()
    customRender(<ChatInput onSendMessage={mockOnSend} isLoading={false} />)

    const input = screen.getByPlaceholderText(/メッセージを入力/) as HTMLInputElement
    const button = screen.getByRole('button', { name: /送信/ })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(button)

    expect(input.value).toBe('')
  })

  it('should not send empty messages', () => {
    const mockOnSend = vi.fn()
    customRender(<ChatInput onSendMessage={mockOnSend} isLoading={false} />)

    const button = screen.getByRole('button', { name: /送信/ })
    fireEvent.click(button)

    expect(mockOnSend).not.toHaveBeenCalled()
  })

  it('should disable input when loading', () => {
    const mockOnSend = vi.fn()
    customRender(<ChatInput onSendMessage={mockOnSend} isLoading={true} />)

    const input = screen.getByPlaceholderText(/メッセージを入力/)
    expect(input).toBeDisabled()
  })
})
