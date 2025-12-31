import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/db/prisma'
import { chatAgent } from '@/src/lib/mastra'

// POST /api/chat - メッセージ送信（ストリーミング）
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      conversationId?: string
      message: string
      images?: Array<{ data: string; type: string }>
    }

    const { conversationId, message, images = [] } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let conversation

    // Conversationがなければ作成
    if (!conversationId) {
      try {
        conversation = await prisma.conversation.create({
          data: {},
        })
      } catch (dbError) {
        console.error('Database error creating conversation:', dbError)
        conversation = {
          id: `conv_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    } else {
      try {
        conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        })
        if (!conversation) {
          return NextResponse.json(
            { error: 'Conversation not found' },
            { status: 404 }
          )
        }
      } catch (dbError) {
        console.error('Database error finding conversation:', dbError)
        conversation = { id: conversationId, createdAt: new Date(), updatedAt: new Date() }
      }
    }

    // ユーザーメッセージを保存
    const imageDataArray = images.map((img) => `data:${img.type};base64,${img.data}`)
    try {
      await prisma.message.create({
        data: {
          role: 'user',
          content: message,
          images: imageDataArray,
          conversationId: conversation.id,
        },
      })
    } catch (dbError) {
      console.error('Error saving user message:', dbError)
    }

    // ReadableStream でストリーミング応答を返す
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // マルチモーダルコンテンツの準備
          const response = images.length > 0
            ? await chatAgent.stream([
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: message },
                    ...images.map((img) => ({
                      type: 'image',
                      image: `data:${img.type};base64,${img.data}`,
                      mimeType: img.type,
                    })),
                  ],
                },
              ])
            : await chatAgent.stream(message)

          let fullText = ''
          for await (const chunk of response.textStream) {
            fullText += chunk
            controller.enqueue(new TextEncoder().encode(chunk))
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
            console.error('Error saving assistant message:', dbError)
          }

          controller.close()
        } catch (agentError) {
          console.error('Error in agent stream:', agentError)

          // Mock response if agent fails
          const mockResponse = `申し訳ありません。現在、AIエージェントが利用できません。メッセージ: "${message}" に対して、テスト応答を返しています。本番環境ではAnthropicのAPIが必要です。エラー: ${agentError instanceof Error ? agentError.message : 'Unknown error'}`
          controller.enqueue(new TextEncoder().encode(mockResponse))

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

          controller.close()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Error in /api/chat:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
