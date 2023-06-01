import { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionRequest, OpenAIAPI } from 'openai';

const openai = new OpenAIAPI({ key: process.env.OPENAI_SECRET_KEY });

// Edamam API setup here...

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const chatRequest = new ChatCompletionRequest({
      model: 'text-davinci-002',
      messages: req.body.messages,
    });
    const chatResponse = await openai.completeChat(chatRequest);
    const userMessage = chatResponse['choices'][0]['message']['content'];

    // Here you might call Edamam API with user's message, parse the result, and include it in your GPT-3's messages.

    res.status(200).json({ chat: chatResponse });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
