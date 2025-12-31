'use client'

import { Box, Button, Input, HStack } from '@chakra-ui/react'
import { useState } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
    >
      <HStack spacing={2}>
        <Input
          placeholder="メッセージを入力してください..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          size="lg"
          borderRadius="lg"
        />
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          size="lg"
        >
          送信
        </Button>
      </HStack>
    </Box>
  )
}
