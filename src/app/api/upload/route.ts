import { NextRequest, NextResponse } from 'next/server'
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from '@/src/types'

// POST /api/upload - 画像アップロード
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // ファイルサイズチェック
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_IMAGE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      )
    }

    // ファイル形式チェック
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // ファイルをBase64に変換
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    return NextResponse.json({
      id: `img_${Date.now()}`,
      data: base64,
      type: file.type,
      name: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error('Error in /api/upload:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
