'use client'

import { Box, Text } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <Box
      display="flex"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      mb={4}
    >
      <Box
        maxW="70%"
        borderRadius="lg"
        px={4}
        py={3}
        bg={isUser ? 'blue.500' : 'gray.200'}
        color={isUser ? 'white' : 'black'}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <Text mb={2}>{children}</Text>,
            code: ({ children }) => (
              <Box
                as="code"
                bg={isUser ? 'blue.600' : 'gray.300'}
                px={2}
                py={1}
                borderRadius="md"
                fontFamily="monospace"
                fontSize="sm"
              >
                {children}
              </Box>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Box>
  )
}
