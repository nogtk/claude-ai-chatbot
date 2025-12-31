'use client'

import { useState, useCallback } from 'react'
import { Message, ImageAttachment } from '@/src/types'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (message: string, images?: ImageAttachment[]) => {
      if (!message.trim()) return

      // Add user message to the list
      const userMessage: Message = {
        role: 'user',
        content: message,
        images: images?.map((img) => `data:${img.type};base64,${img.data}`),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Create a new conversation if needed
        let currentConversationId = conversationId
        if (!currentConversationId) {
          const resp = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          })
          const data = await resp.json()
          currentConversationId = data.id
          setConversationId(currentConversationId)
        }

        // Send message to API with streaming
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: currentConversationId,
            message,
            images: images?.map((img) => ({ data: img.data, type: img.type })),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to send message')
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            assistantMessage += chunk

            // Update the last message in the list
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1]
              if (lastMsg && lastMsg.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMsg, content: assistantMessage },
                ]
              } else {
                return [...prev, { role: 'assistant', content: assistantMessage }]
              }
            })
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'エラーが発生しました。もう一度試してください。',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId]
  )

  return {
    messages,
    isLoading,
    sendMessage,
    conversationId,
  }
}
