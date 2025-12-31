# AI Chatbot Project

Claude検証目的のエンターテイメント向けAIチャットボットアプリケーション。

## Tech Stack

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript |
| APIサーバー | Hono |
| ORM | Prisma |
| データベース | MongoDB |
| AIエージェント | Mastra |
| AIモデル | Anthropic Claude |
| UIライブラリ | Chakra UI |
| テスト | Vitest |
| デプロイ | Google Cloud |

## Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # チャットUI
│   │   └── api/
│   │       └── [...route]/     # Hono API routes
│   │           └── route.ts
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   └── ui/                 # Chakra UI wrappers
│   ├── lib/
│   │   ├── mastra/             # Mastra Agent設定
│   │   │   ├── index.ts
│   │   │   └── tools/          # カスタムツール
│   │   │       ├── datetime.ts
│   │   │       └── calculator.ts
│   │   ├── db/
│   │   │   └── prisma.ts       # Prisma client
│   │   └── hono/
│   │       └── app.ts          # Hono app instance
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       └── useChat.ts
├── prisma/
│   └── schema.prisma
├── tests/
│   ├── unit/
│   └── integration/
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── next.config.js
```

## Features

### Core Features
- リアルタイムストリーミング応答
- 会話履歴の永続化 (MongoDB)
- 基本ツール（時刻取得、計算）

### UI/UX
- Chakra UIによるレスポンシブデザイン
- ダークモード対応
- メッセージのマークダウンレンダリング

### 認証
- なし（誰でも利用可能）

## Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Conversation {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
}

model Message {
  id             String       @id @default(auto()) @map("_id") @db.ObjectId
  role           String       // "user" | "assistant"
  content        String
  createdAt      DateTime     @default(now())
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  conversationId String       @db.ObjectId
}
```

## API Endpoints

### Hono Routes (`/api/*`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chat` | メッセージ送信（ストリーミング応答） |
| GET | `/api/conversations` | 会話一覧取得 |
| GET | `/api/conversations/:id` | 会話詳細取得 |
| DELETE | `/api/conversations/:id` | 会話削除 |

## Agent Configuration

### Mastra Agent Setup

```typescript
// src/lib/mastra/index.ts
import { Agent } from '@mastra/core/agent'
import { datetimeTool } from './tools/datetime'
import { calculatorTool } from './tools/calculator'

export const chatAgent = new Agent({
  id: 'chat-agent',
  name: 'Chat Agent',
  instructions: 'You are a helpful and friendly AI assistant.',
  model: 'anthropic/claude-sonnet-4-20250514',
  tools: { datetimeTool, calculatorTool },
})
```

### Streaming Response

```typescript
// ストリーミング応答の処理
const stream = await chatAgent.stream('Hello!')

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}

// フルストリーム（ツール呼び出し含む）
for await (const chunk of stream.fullStream) {
  switch (chunk.type) {
    case 'text-delta':
      process.stdout.write(chunk.payload.text)
      break
    case 'tool-call':
      console.log(`Calling ${chunk.payload.toolName}...`)
      break
    case 'finish':
      console.log(`Done! Reason: ${chunk.payload.stepResult.reason}`)
      break
  }
}
```

### Built-in Tools

#### Datetime Tool
```typescript
// src/lib/mastra/tools/datetime.ts
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const datetimeTool = createTool({
  id: 'get_current_datetime',
  description: 'Get the current date and time',
  inputSchema: z.object({
    timezone: z.string().optional().describe('Timezone (e.g., Asia/Tokyo)'),
  }),
  outputSchema: z.object({
    datetime: z.string(),
  }),
  execute: async ({ context }) => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: context.timezone || 'Asia/Tokyo',
      dateStyle: 'full',
      timeStyle: 'long',
    }
    return {
      datetime: new Intl.DateTimeFormat('ja-JP', options).format(now),
    }
  },
})
```

#### Calculator Tool
```typescript
// src/lib/mastra/tools/calculator.ts
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const calculatorTool = createTool({
  id: 'calculate',
  description: 'Perform mathematical calculations',
  inputSchema: z.object({
    expression: z.string().describe('Mathematical expression to evaluate'),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ context }) => {
    // 安全な計算処理（evalは使用しない）
    // math.jsなどのライブラリを使用
    return {
      result: evaluate(context.expression),
    }
  },
})
```

## Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="mongodb://localhost:27017/ai-chatbot"

# Anthropic API
ANTHROPIC_API_KEY=""

# Google Cloud (for deployment)
GOOGLE_CLOUD_PROJECT=""
GOOGLE_CLOUD_REGION="asia-northeast1"
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Start production server
npm start

# Prisma
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
npx prisma studio      # Open Prisma Studio
```

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "@chakra-ui/react": "^2.x",
    "@chakra-ui/next-js": "^2.x",
    "@emotion/react": "^11.x",
    "@emotion/styled": "^11.x",
    "framer-motion": "^11.x",
    "hono": "^4.x",
    "@mastra/core": "^0.x",
    "@prisma/client": "^5.x",
    "zod": "^3.x",
    "react-markdown": "^9.x",
    "mathjs": "^13.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "prisma": "^5.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x"
  }
}
```

## Deployment (Google Cloud)

### Architecture
- **Compute**: Cloud Run
- **Database**: MongoDB Atlas
- **AI**: Anthropic Claude API (直接)
- **Container Registry**: Artifact Registry

### CI/CD
- GitHub Actions for automated deployment
- Cloud Build for container builds

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### Deploy Command

```bash
# Cloud Run へデプロイ
gcloud run deploy ai-chatbot \
  --source . \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --set-env-vars "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY,DATABASE_URL=$DATABASE_URL"
```

## Coding Conventions

- ファイル名: kebab-case (`chat-input.tsx`)
- コンポーネント名: PascalCase (`ChatInput`)
- 関数名: camelCase (`sendMessage`)
- 定数: UPPER_SNAKE_CASE (`MAX_MESSAGE_LENGTH`)
- TypeScript strictモード有効
- ESLint + Prettier でコード品質管理

## Testing Strategy

- **Unit Tests**: 個々のツール、ユーティリティ関数
- **Integration Tests**: API エンドポイント
- **Component Tests**: React コンポーネント（Testing Library）

```typescript
// tests/unit/tools/calculator.test.ts
import { describe, it, expect } from 'vitest'
import { calculatorTool } from '@/lib/mastra/tools/calculator'

describe('calculatorTool', () => {
  it('should calculate simple expressions', async () => {
    const result = await calculatorTool.execute({
      context: { expression: '2 + 2' }
    })
    expect(result.result).toBe('4')
  })
})
```

## Future Enhancements

- [ ] ユーザー認証（NextAuth.js）
- [ ] 複数ペルソナ切り替え
- [ ] RAG機能（ドキュメント検索）
- [ ] Web検索ツール
- [ ] 画像生成機能
- [ ] 音声入出力
