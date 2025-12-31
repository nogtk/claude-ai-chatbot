export interface Message {
  role: 'user' | 'assistant'
  content: string
  images?: string[]
}

export interface ImageAttachment {
  id: string
  data: string // base64 encoded image
  type: string // MIME type (image/jpeg, image/png, etc.)
  name: string
  size: number
}

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_IMAGES = 4
export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]
