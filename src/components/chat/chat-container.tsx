'use client'

import { Box, Container, VStack, Heading } from '@chakra-ui/react'
import { useChat } from '@/src/hooks/use-chat'
import { ChatInput } from './chat-input'
import { MessageList } from './message-list'

export function ChatContainer() {
  const { messages, isLoading, sendMessage } = useChat()

  return (
    <Container
      maxW="2xl"
      h="100vh"
      py={4}
      display="flex"
      flexDirection="column"
    >
      <VStack
        spacing={4}
        h="100%"
      >
        <Box textAlign="center">
          <Heading as="h1" size="lg">
            Claude AI Chatbot
          </Heading>
        </Box>

        <MessageList messages={messages} />

        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </VStack>
    </Container>
  )
}
