'use client'

import { Box, Text, Image, SimpleGrid } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  images?: string[]
}

export function MessageBubble({ role, content, images }: MessageBubbleProps) {
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
        {images && images.length > 0 && (
          <SimpleGrid columns={images.length > 1 ? 2 : 1} spacing={2} mb={2}>
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Attachment ${index + 1}`}
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
              />
            ))}
          </SimpleGrid>
        )}
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
