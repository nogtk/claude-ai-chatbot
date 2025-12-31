'use client'

import { Box } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { MessageBubble } from './message-bubble'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box
      flex={1}
      overflowY="auto"
      p={4}
      bg="gray.50"
      borderRadius="lg"
      css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
      }}
    >
      {messages.length === 0 ? (
        <Box
          textAlign="center"
          color="gray.500"
          mt={8}
        >
          メッセージはまだありません。何か質問してみてください！
        </Box>
      ) : (
        messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            role={msg.role}
            content={msg.content}
          />
        ))
      )}
      <div ref={endRef} />
    </Box>
  )
}
