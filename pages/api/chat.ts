import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIApi, Configuration } from 'openai';

// OpenAI API の設定を作成
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI API クライアントを初期化
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const prompt = req.body.message;
    const maxTokens = 60;

    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: maxTokens,
    });

    // Here you might call Edamam API with user's message, parse the result, and include it in your GPT-3's messages.

    res.status(200).json({ chat: gptResponse.data });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
