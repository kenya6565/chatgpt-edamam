# ChatGPTとQiita記事検索アプリケーション

このプロジェクトは、Next.js, ChatGPT API, Qiita API を利用したアプリケーションで、ユーザーがテキストボックスに入力した情報に関連する記事を ChatGPT が理解し、Qiita API を通じて表示します。

## 開発環境構築

1. リポジトリをクローンします:

   ```
   git clone https://github.com/kenya6565/qiita-gpt.git
   ```

2. プロジェクトのディレクトリに移動します:

   ```
   cd your-project-name
   ```

3. 依存関係をインストールします:

   ```
   npm install
   ```

## 環境変数の設定

プロジェクトのルートに`.env.local`ファイルを作成し、以下の環境変数を設定します:

```
OPENAI_API_KEY=your_openai_api_key
QIITA_API_KEY=your_qiita_api_key
```

## 開発サーバーの起動

開発サーバーを起動します:

```
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。変更すると、ページはリロードされます。

## デプロイ

[Vercel](https://vercel.com)、[Netlify](https://www.netlify.com/)、あるいはその他の Next.js をサポートするホスティングプラットフォームを利用して、本番環境にデプロイできます。

## 使用技術

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material-UI](https://mui.com/)
- [ChatGPT API](https://beta.openai.com/)
- [Qiita API](https://qiita.com/api/v2/docs)
