import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/db/prisma'

// GET /api/conversations/:id - 会話詳細取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      })

      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(conversation)
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return mock conversation for development
      return NextResponse.json({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
      })
    }
  } catch (error) {
    console.error('Error in GET /conversations/:id:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// DELETE /api/conversations/:id - 会話削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    try {
      await prisma.conversation.delete({
        where: { id },
      })

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Mock success response for development
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error in DELETE /conversations/:id:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
