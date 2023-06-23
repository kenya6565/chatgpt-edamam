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
    const userInput = req.body.message;
    const prompt = `${userInput}とは何ですか？分かりやすく日本語で答えてください。`;
    const maxTokens = 300;

    // send request towards Open API
    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: maxTokens,
    });

    // Check if data exists in the response
    if (!gptResponse.data.choices[0].text) {
      res.status(500).json({ error: 'Unexpected response from GPT-3' });
      return;
    }

    // Return the chat response
    res.status(200).json({ chat: gptResponse.data });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
