import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIApi, Configuration } from 'openai';
import axios from 'axios';

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

    // Check if data exists in the response
    if (!gptResponse.data.choices[0].text) {
      res.status(500).json({ error: 'Unexpected response from GPT-3' });
      return;
    }

    // Use the ChatGPT response as a keyword to search articles on Qiita
    const keyword = gptResponse.data.choices[0].text.trim();

    const qiitaResponse = await axios.get(
      `https://qiita.com/api/v2/items?page=1&per_page=10&query=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QIITA_API_KEY}`,
        },
      },
    );

    // Return both the chat response and the articles
    res
      .status(200)
      .json({ chat: gptResponse.data, articles: qiitaResponse.data });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
