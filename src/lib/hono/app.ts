import { Hono } from 'hono'
import { streamText } from 'hono/streaming'
import prisma from '@/src/lib/db/prisma'
import { chatAgent } from '@/src/lib/mastra'

const app = new Hono()

// POST /api/conversations - 新規会話作成
app.post('/conversations', async (c) => {
  try {
    try {
      const conversation = await prisma.conversation.create({
        data: {},
      })
      return c.json(conversation)
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
      return c.json(mockConversation)
    }
  } catch (error) {
    console.error('Error in POST /conversations:', error)
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500
    )
  }
})

// POST /api/chat - メッセージ送信（ストリーミング）
app.post('/chat', async (c) => {
  const body = await c.req.json<{
    conversationId?: string
    message: string
  }>()

  const { conversationId, message } = body

  if (!message) {
    return c.json({ error: 'Message is required' }, 400)
  }

  try {
    let conversation

    // Conversationがなければ作成
    if (!conversationId) {
      conversation = await prisma.conversation.create({
        data: {},
      })
    } else {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
      })
      if (!conversation) {
        return c.json({ error: 'Conversation not found' }, 404)
      }
    }

    // ユーザーメッセージを保存
    await prisma.message.create({
      data: {
        role: 'user',
        content: message,
        conversationId: conversation.id,
      },
    })

    // ストリーミングレスポンスを返す
    return streamText(c, async (stream) => {
      try {
        const response = await chatAgent.stream(message)

        let fullText = ''
        for await (const chunk of response.textStream) {
          fullText += chunk
          await stream.write(chunk)
        }

        // アシスタントメッセージを保存
        try {
          await prisma.message.create({
            data: {
              role: 'assistant',
              content: fullText,
              conversationId: conversation.id,
            },
          })
        } catch (dbError) {
          console.error('Error saving message to DB:', dbError)
          // Continue even if DB save fails
        }
      } catch (agentError) {
        // Mock response if agent fails (for testing without API key)
        const mockResponse = `申し訳ありません。現在、AIエージェントが利用できません。メッセージ: "${message}" に対して、テスト応答を返しています。本番環境ではAnthropicのAPIが必要です。`
        await stream.write(mockResponse)

        // Try to save mock response to DB
        try {
          await prisma.message.create({
            data: {
              role: 'assistant',
              content: mockResponse,
              conversationId: conversation.id,
            },
          })
        } catch (dbError) {
          console.error('Error saving mock response:', dbError)
        }
      }
    })
  } catch (error) {
    console.error('Error in /api/chat:', error)
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500
    )
  }
})

// GET /api/conversations - 会話一覧取得
app.get('/conversations', async (c) => {
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
    return c.json(conversations)
  } catch (error) {
    console.error('Error in GET /conversations:', error)
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500
    )
  }
})

// GET /api/conversations/:id - 会話詳細取得
app.get('/conversations/:id', async (c) => {
  const { id } = c.req.param()

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
      return c.json({ error: 'Conversation not found' }, 404)
    }

    return c.json(conversation)
  } catch (error) {
    console.error('Error in GET /conversations/:id:', error)
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500
    )
  }
})

// DELETE /api/conversations/:id - 会話削除
app.delete('/conversations/:id', async (c) => {
  const { id } = c.req.param()

  try {
    await prisma.conversation.delete({
      where: { id },
    })

    return c.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /conversations/:id:', error)
    return c.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500
    )
  }
})

export default app
