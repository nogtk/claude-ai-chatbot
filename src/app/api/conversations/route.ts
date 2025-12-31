import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/db/prisma'

// POST /api/conversations - 新規会話作成
export async function POST(_request: NextRequest) {
  try {
    try {
      const conversation = await prisma.conversation.create({
        data: {},
      })
      return NextResponse.json(conversation)
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return a mock conversation for development/testing
      const mockConversation = {
        id: `conv_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      console.warn(
        'Using mock conversation due to database error. Set up MongoDB or update DATABASE_URL.'
      )
      return NextResponse.json(mockConversation)
    }
  } catch (error) {
    console.error('Error in POST /conversations:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// GET /api/conversations - 会話一覧取得
export async function GET(_request: NextRequest) {
  try {
    try {
      const conversations = await prisma.conversation.findMany({
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
      })
      return NextResponse.json(conversations)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Error in GET /conversations:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
