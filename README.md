# Claude AI Chatbot

Claude 検証目的のエンターテイメント向けAIチャットボットアプリケーション。Mastra フレームワーク、Next.js、Hono、Prisma、MongoDB を使用して構築されています。

## 🚀 クイックスタート

### 前提条件
- Docker & Docker Compose
- Node.js 20+ (ローカル開発時)
- Anthropic API キー

### Docker Compose での起動（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/nogtk/claude-ai-chatbot.git
cd claude-ai-chatbot

# 環境変数を設定
export ANTHROPIC_API_KEY="your-api-key-here"

# Docker Compose で起動
docker-compose up -d

# ログを確認
docker-compose logs -f app
```

アプリケーションは `http://localhost:3000` で利用可能です。

### ローカル開発（MongoDB Docker のみ）

```bash
# MongoDB のみを Docker で起動
docker-compose up mongodb -d

# ローカルで依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは `http://localhost:3000` で利用可能です。

## 📋 開発コマンド

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start

# テストの実行
npm run test

# テストカバレッジの生成
npm run test:coverage

# ESLint の実行
npm run lint
```

## 🐳 Docker Compose コマンド

```bash
# 起動
docker-compose up -d

# ログ確認
docker-compose logs -f

# 停止
docker-compose down

# ボリュームを含めて削除
docker-compose down -v

# コンテナを再ビルド
docker-compose up --build -d

# 特定のサービスのみ起動
docker-compose up mongodb -d
```

## 🗄️ MongoDB

### 接続情報

- **Host**: `mongodb` (Docker Compose 経由) / `localhost` (ローカル)
- **Port**: `27017`
- **Database**: `ai-chatbot`
- **Connection URL**: `mongodb://localhost:27017/ai-chatbot`

### Prisma コマンド

```bash
# Prisma Client を生成
npx prisma generate

# スキーマをDBにプッシュ
npx prisma db push

# Prisma Studio を開く（GUI）
npx prisma studio
```

## 🔌 API エンドポイント

### チャット

- **POST** `/api/chat` - メッセージ送信（ストリーミング応答）
  ```bash
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"conversationId": "conv_123", "message": "Hello!"}'
  ```

### 会話

- **POST** `/api/conversations` - 新規会話作成
- **GET** `/api/conversations` - 会話一覧取得
- **GET** `/api/conversations/:id` - 会話詳細取得
- **DELETE** `/api/conversations/:id` - 会話削除

## 🔐 環境変数

```bash
# .env.local
DATABASE_URL="mongodb://localhost:27017/ai-chatbot"
ANTHROPIC_API_KEY="your-api-key-here"
GOOGLE_CLOUD_PROJECT="your-gcp-project"
GOOGLE_CLOUD_REGION="asia-northeast1"
```

## 🏗️ プロジェクト構造

```
.
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/[...route]/     # Hono API routes
│   ├── components/
│   │   └── chat/               # チャットUIコンポーネント
│   ├── lib/
│   │   ├── mastra/             # Mastra Agent 設定
│   │   ├── hono/               # Hono API サーバー
│   │   └── db/                 # Prisma DB クライアント
│   ├── hooks/
│   │   └── use-chat.ts         # チャットロジック
│   └── types/
├── prisma/
│   └── schema.prisma           # Prisma スキーマ
├── tests/                       # テストファイル
├── .github/workflows/           # CI/CD パイプライン
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

## 🧪 テスト

### ユニットテスト
```bash
npm run test
```

### テストカバレッジ
```bash
npm run test:coverage
```

## 🚀 デプロイ

### Google Cloud Run へのデプロイ

1. **Google Cloud プロジェクトを設定**
   ```bash
   gcloud init
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Artifact Registry リポジトリを作成**
   ```bash
   gcloud artifacts repositories create ai-chatbot \
     --location=asia-northeast1 \
     --repository-format=docker
   ```

3. **サービスアカウントと Workload Identity を設定**
   - GitHub リポジトリに Secrets を追加
   - `GOOGLE_CLOUD_PROJECT`
   - `SERVICE_ACCOUNT_EMAIL`
   - `WORKLOAD_IDENTITY_PROVIDER`
   - `ANTHROPIC_API_KEY`
   - `DATABASE_URL`

4. **main ブランチへ push**
   ```bash
   git push origin main
   ```

GitHub Actions が自動で Cloud Run にデプロイします。

## 📊 Tech Stack

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 |
| 言語 | TypeScript |
| APIサーバー | Hono |
| AIエージェント | Mastra |
| AIモデル | Anthropic Claude |
| ORM | Prisma |
| データベース | MongoDB |
| UIライブラリ | Chakra UI |
| テスト | Vitest + Testing Library |
| コンテナ化 | Docker & Docker Compose |

## 🐛 トラブルシューティング

### MongoDB に接続できない

```bash
# MongoDB の状態を確認
docker-compose ps

# MongoDB のログを確認
docker-compose logs mongodb

# MongoDB を再起動
docker-compose restart mongodb
```

### アプリケーションが起動しない

```bash
# ビルドキャッシュをクリア
docker-compose down -v
docker-compose up --build -d

# ログを確認
docker-compose logs app
```

### ポートがすでに使用されている

```bash
# 別のポートを使用する場合は docker-compose.yml を編集
# ports:
#   - "3001:3000"  # 3001 を使用
```

## 📝 ライセンス

MIT

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずイシューを開いて変更内容を議論してください。
