# Docker & Docker Compose セットアップガイド

このプロジェクトは Docker と Docker Compose を使用して開発・デプロイができるように構成されています。

## 📋 インストール

### macOS

#### Docker Desktop のインストール

1. [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop) をダウンロード
2. インストーラーを実行
3. Dock から Docker アイコンをクリックして起動
4. メニューバーのDocker アイコンから "Docker is running" を確認

#### ターミナルで確認

```bash
docker --version
docker-compose --version
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install docker.io docker-compose

# CentOS/RHEL
sudo yum install docker docker-compose

# 起動
sudo systemctl start docker
sudo systemctl enable docker

# 権限設定（sudo なしで使用する場合）
sudo usermod -aG docker $USER
newgrp docker
```

### Windows

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop) をダウンロード
2. インストーラーを実行
3. システム再起動
4. PowerShell または CMD で確認

```powershell
docker --version
docker-compose --version
```

## 🚀 使用方法

### MongoDB のみを起動（ローカル開発）

```bash
# MongoDB コンテナを起動
docker-compose up mongodb -d

# ログを確認
docker-compose logs mongodb

# ローカルで npm install と npm run dev を実行
npm install
npm run dev
```

**MongoDB 接続情報：**
- URL: `mongodb://localhost:27017/ai-chatbot`
- ホスト: `localhost`
- ポート: `27017`

### 全コンテナを起動（Docker Compose 開発環境）

```bash
# Anthropic API キーを設定
export ANTHROPIC_API_KEY="sk-ant-..."

# コンテナを起動
docker-compose up -d

# ログを確認
docker-compose logs -f app

# ブラウザで http://localhost:3000 にアクセス
```

### 停止と削除

```bash
# 停止
docker-compose down

# ボリューム（データ）も削除
docker-compose down -v

# 再ビルド
docker-compose up --build -d
```

## 🐛 トラブルシューティング

### Docker デーモンが起動していない（macOS）

```bash
# Docker Desktop を起動してください
# Launchpad または Applications フォルダから Docker を起動
open /Applications/Docker.app

# または Spotlight 検索（Cmd + Space）で "Docker" と入力して起動
```

### ポート 27017 がすでに使用されている

```bash
# 使用しているプロセスを確認
lsof -i :27017

# ポートを変更する場合は docker-compose.yml を編集
# ports:
#   - "27018:27017"  # ホスト側 27018 を使用
```

### MongoDB に接続できない

```bash
# MongoDB の状態を確認
docker-compose ps

# ヘルスチェックを確認
docker-compose logs mongodb

# MongoDB コンテナを再起動
docker-compose restart mongodb

# MongoDB コンテナに接続してテスト
docker exec -it claude-ai-chatbot-mongodb mongosh
> db.runCommand("ping")
```

### アプリケーションログを確認

```bash
# 全コンテナのログ
docker-compose logs

# アプリケーションのみ
docker-compose logs app

# MongoDB のみ
docker-compose logs mongodb

# リアルタイムで確認
docker-compose logs -f app
```

### コンテナ内でコマンドを実行

```bash
# npm コマンド
docker-compose exec app npm run test

# npm run build
docker-compose exec app npm run build

# Prisma コマンド
docker-compose exec app npx prisma studio
```

## 📁 ボリュームマウント

### 開発時のボリューム

`docker-compose.yml` で以下のボリュームがマウントされています：

```yaml
volumes:
  - .:/app                    # プロジェクトディレクトリ全体
  - /app/node_modules        # node_modules は除外
  - /app/.next                # .next は除外
```

これにより、ローカルのコード編集が即座にコンテナに反映されます。

### データ永続化

MongoDB のデータは `mongodb_data` ボリュームに保存されます：

```bash
# ボリュームを確認
docker volume ls

# ボリュームの詳細を確認
docker volume inspect claude-ai-chatbot_mongodb_data
```

## 🔧 カスタマイズ

### ポート番号を変更

`docker-compose.yml` を編集：

```yaml
services:
  app:
    ports:
      - "3001:3000"  # ホスト側 3001 を使用
  mongodb:
    ports:
      - "27018:27017"  # ホスト側 27018 を使用
```

### 環境変数を追加

`docker-compose.yml` または `.env` ファイル：

```yaml
app:
  environment:
    NODE_ENV: development
    DATABASE_URL: mongodb://mongodb:27017/ai-chatbot
    CUSTOM_VAR: value
```

### リソース制限を設定

```yaml
app:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

## 📚 参考リンク

- [Docker ドキュメント](https://docs.docker.com/)
- [Docker Compose ドキュメント](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Image](https://hub.docker.com/_/node)

## ✅ よくある質問

**Q: docker-compose.yml のバージョンって何？**
A: Compose ファイル形式のバージョンです。3.8 は広範なサポートがあります。

**Q: node_modules をボリュームから除外する理由は？**
A: ホスト OS とコンテナ OS で互換性がないため、コンテナ内でインストールしたものを使用します。

**Q: ローカルとコンテナで npm パッケージを共有できる？**
A: いいえ、コンテナ内でのみ使用してください。ローカル開発時は `npm install` を実行してください。

**Q: .next ディレクトリをボリュームから除外する理由は？**
A: ビルドアーティファクトなので、コンテナ内で生成されたものを使用します。
