import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const OPENAI_URL = 'api.openai.com';
const DEFAULT_PROTOCOL = 'https';
const PROTOCOL = DEFAULT_PROTOCOL;
const BASE_URL = OPENAI_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const summaryText = `你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语。`;

      const summaryCompletionPromise = requestOpenai({
        method: 'POST',
        path: '/v1/engines/gpt-3.5-turbo/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: summaryText },
            { role: 'user', content: `UserId: ${userId}` },
            { role: 'user', content: dream },
          ],
          max_tokens: 35,
          temperature: 0.9,
        }),
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const summaryCompletion = await summaryCompletionPromise;
      const summaryChoice = summaryCompletion.choices[0];
      const summary =
        summaryChoice && summaryChoice.message && summaryChoice.message.content
          ? summaryChoice.message.content.trim()
          : '';

      console.log('summary=' + summary);

      const rolePlayText = ` `;

      const chatCompletionPromise = requestOpenai({
        method: 'POST',
        path: '/v1/engines/gpt-3.5-turbo/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: rolePlayText },
            { role: 'user', content: `UserId: ${userId}` },
            { role: 'user', content: summary },
          ],
          temperature: 1,
          max_tokens: 888,
        }),
      });

      const chatCompletion = await chatCompletionPromise;

      const answer = chatCompletion.choices[0].message.content;
      res.status(200).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function requestOpenai(options: {
  method: string;
  path: string;
  headers: any;
  body: string;
}) {
  const controller = new AbortController();

  let baseUrl = BASE_URL;

  if (!baseUrl.startsWith('http')) {
    baseUrl = `${PROTOCOL}://${baseUrl}`;
  }

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const fetchUrl = `${baseUrl}${options.path}`;
  const fetchOptions: RequestInit = {
    headers: options.headers,
    method: options.method,
    body: options.body,
    redirect: 'follow',
    signal: controller.signal,
  };

  try {
    const res = await fetch(fetchUrl, fetchOptions);

    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete('www-authenticate');

    return res.json();
  } finally {
    controller.abort();
  }
}
