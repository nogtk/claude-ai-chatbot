'use client'

import {
  Box,
  Button,
  Input,
  HStack,
  VStack,
  IconButton,
  useToast,
  VisuallyHiddenInput,
} from '@chakra-ui/react'
import { AttachmentIcon } from '@chakra-ui/icons'
import { useState, useRef } from 'react'
import { ImageAttachment, MAX_IMAGE_SIZE, MAX_IMAGES, ALLOWED_IMAGE_TYPES } from '@/src/types'
import { ImagePreview } from './image-preview'

interface ChatInputProps {
  onSendMessage: (message: string, images?: ImageAttachment[]) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [images, setImages] = useState<ImageAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() || images.length > 0) {
      onSendMessage(input, images.length > 0 ? images : undefined)
      setInput('')
      setImages([])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      // チェック: 最大数
      if (images.length >= MAX_IMAGES) {
        toast({
          title: 'エラー',
          description: `最大${MAX_IMAGES}枚まで添付できます`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        break
      }

      // チェック: ファイル形式
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: 'エラー',
          description: `サポートされていない形式です: ${file.type}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        continue
      }

      // チェック: ファイルサイズ
      if (file.size > MAX_IMAGE_SIZE) {
        toast({
          title: 'エラー',
          description: `ファイルサイズが大きすぎます: ${file.name}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        continue
      }

      // Base64に変換
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]
        const newImage: ImageAttachment = {
          id: `img_${Date.now()}_${Math.random()}`,
          data: base64,
          type: file.type,
          name: file.name,
          size: file.size,
        }
        setImages((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    }

    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
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
      <VStack spacing={2} align="stretch">
        <ImagePreview images={images} onRemove={handleRemoveImage} />
        <HStack spacing={2}>
          <IconButton
            aria-label="画像を添付"
            icon={<AttachmentIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || images.length >= MAX_IMAGES}
            size="lg"
          />
          <VisuallyHiddenInput
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            multiple
            onChange={handleFileSelect}
          />
          <Input
            placeholder="メッセージを入力してください..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            size="lg"
            borderRadius="lg"
          />
          <Button type="submit" colorScheme="blue" isLoading={isLoading} size="lg">
            送信
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
