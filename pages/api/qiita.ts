import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Use the ChatGPT response as a keyword to search articles on Qiita
    const keyword = req.body.keyword;

    // send request towards Qiita API with response of Open API
    const qiitaResponse = await axios.get(
      `https://qiita.com/api/v2/items?page=1&per_page=10&query=${keyword}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QIITA_API_KEY}`,
        },
      },
    );

    // Return the articles
    res.status(200).json({ articles: qiitaResponse.data });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
