# AI Chatbot 構築 TODO

## Phase 1: プロジェクト初期セットアップ

- [ ] Next.js プロジェクト作成 (`npx create-next-app@latest --typescript --app`)
- [ ] 必要な依存パッケージをインストール
  - [ ] Hono (`hono`, `@hono/node-server`)
  - [ ] Mastra (`@mastra/core`)
  - [ ] Prisma (`prisma`, `@prisma/client`)
  - [ ] Chakra UI (`@chakra-ui/react`, `@chakra-ui/next-js`, `@emotion/react`, `@emotion/styled`, `framer-motion`)
  - [ ] その他 (`zod`, `react-markdown`, `mathjs`)
- [ ] TypeScript 設定の調整 (`tsconfig.json`)
- [ ] ESLint / Prettier 設定
- [ ] 環境変数ファイル作成 (`.env.local`, `.env.example`)

## Phase 2: データベース設定

- [ ] Prisma 初期化 (`npx prisma init`)
- [ ] MongoDB 接続設定 (`schema.prisma`)
- [ ] スキーマ定義
  - [ ] Conversation モデル
  - [ ] Message モデル
- [ ] Prisma Client 生成 (`npx prisma generate`)
- [ ] DB接続ヘルパー作成 (`src/lib/db/prisma.ts`)

## Phase 3: Mastra Agent 設定

- [ ] Mastra ディレクトリ構造作成 (`src/lib/mastra/`)
- [ ] Agent 定義 (`src/lib/mastra/index.ts`)
- [ ] ツール実装
  - [ ] Datetime ツール (`src/lib/mastra/tools/datetime.ts`)
  - [ ] Calculator ツール (`src/lib/mastra/tools/calculator.ts`)
- [ ] Agent のテスト作成

## Phase 4: API エンドポイント実装

- [ ] Hono アプリ設定 (`src/lib/hono/app.ts`)
- [ ] Next.js Route Handler 統合 (`src/app/api/[...route]/route.ts`)
- [ ] エンドポイント実装
  - [ ] `POST /api/chat` - メッセージ送信（ストリーミング）
  - [ ] `GET /api/conversations` - 会話一覧取得
  - [ ] `GET /api/conversations/:id` - 会話詳細取得
  - [ ] `DELETE /api/conversations/:id` - 会話削除
- [ ] ストリーミングレスポンス処理の実装
- [ ] エラーハンドリング

## Phase 5: フロントエンド UI 実装

- [ ] Chakra UI Provider 設定 (`src/app/providers.tsx`)
- [ ] レイアウト作成 (`src/app/layout.tsx`)
- [ ] チャットコンポーネント実装
  - [ ] `ChatContainer.tsx` - メインコンテナ
  - [ ] `MessageList.tsx` - メッセージ一覧
  - [ ] `MessageBubble.tsx` - 個別メッセージ表示
  - [ ] `ChatInput.tsx` - 入力フォーム
- [ ] カスタムフック作成 (`src/hooks/useChat.ts`)
- [ ] ストリーミング表示の実装
- [ ] マークダウンレンダリング
- [ ] ダークモード対応

## Phase 6: 機能統合・テスト

- [ ] Vitest 設定 (`vitest.config.ts`)
- [ ] ユニットテスト
  - [ ] ツールのテスト
  - [ ] ユーティリティ関数のテスト
- [ ] 統合テスト
  - [ ] API エンドポイントのテスト
- [ ] コンポーネントテスト
  - [ ] Chat コンポーネントのテスト
- [ ] E2E 動作確認

## Phase 7: デプロイ準備

- [ ] Dockerfile 作成
- [ ] `.dockerignore` 作成
- [ ] `next.config.js` で standalone 出力設定
- [ ] Cloud Run 用の設定
- [ ] GitHub Actions ワークフロー作成 (`.github/workflows/deploy.yml`)
- [ ] 本番環境変数の設定

## Phase 8: 本番デプロイ

- [ ] MongoDB Atlas クラスター作成・接続設定
- [ ] Google Cloud プロジェクト設定
- [ ] Artifact Registry リポジトリ作成
- [ ] Cloud Run サービスデプロイ
- [ ] カスタムドメイン設定（任意）
- [ ] 動作確認

---

## 優先度・依存関係

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
                ↘          ↗
                  並行可能
```

- Phase 2 (DB) と Phase 3 (Agent) は並行作業可能
- Phase 4 (API) は Phase 2, 3 完了後
- Phase 5 (UI) は Phase 4 と並行で一部進行可能
- Phase 6 (テスト) は各 Phase 完了ごとに随時実施推奨

## 見積もり作業量

| Phase | 内容 | 規模 |
|-------|------|------|
| 1 | プロジェクト初期セットアップ | 小 |
| 2 | データベース設定 | 小 |
| 3 | Mastra Agent 設定 | 中 |
| 4 | API エンドポイント実装 | 中 |
| 5 | フロントエンド UI 実装 | 大 |
| 6 | 機能統合・テスト | 中 |
| 7 | デプロイ準備 | 小 |
| 8 | 本番デプロイ | 小 |
