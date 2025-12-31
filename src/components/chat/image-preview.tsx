'use client'

import { Box, Image, IconButton, HStack } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { ImageAttachment } from '@/src/types'

interface ImagePreviewProps {
  images: ImageAttachment[]
  onRemove: (id: string) => void
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null

  return (
    <HStack spacing={2} p={2} flexWrap="wrap">
      {images.map((image) => (
        <Box key={image.id} position="relative" width="100px" height="100px">
          <Image
            src={`data:${image.type};base64,${image.data}`}
            alt={image.name}
            width="100%"
            height="100%"
            objectFit="cover"
            borderRadius="md"
          />
          <IconButton
            aria-label="画像を削除"
            icon={<CloseIcon />}
            size="xs"
            position="absolute"
            top={1}
            right={1}
            colorScheme="red"
            onClick={() => onRemove(image.id)}
          />
        </Box>
      ))}
    </HStack>
  )
}
