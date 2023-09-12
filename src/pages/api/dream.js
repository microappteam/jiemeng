import { Configuration, OpenAIApi } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  timeout: 60000,
});

const openai = new OpenAIApi(configuration);

async function requestOpenai(options) {
  const response = await fetch(
    'https://api.openai.com/v1/engines/davinci-codex/completions',
    options,
  );
  const data = await response.json();
  return data;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const summaryText =
        '你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语。';
      const summaryCompletionPromise = openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: summaryText },
          { role: 'user', content: `UserId: ${userId}` },
          { role: 'user', content: dream },
        ],
        max_tokens: 35,
        temperature: 0.9,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const summaryCompletion = await summaryCompletionPromise;
      const summaryChoice = summaryCompletion.data.choices[0];
      const summary =
        summaryChoice && summaryChoice.message && summaryChoice.message.content
          ? summaryChoice.message.content.trim()
          : '';

      console.log('summary=' + summary);

      const rolePlayText = '';

      const chatCompletionPromise = requestOpenai({
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        method: 'POST',
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
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
          throw new Error('Failed to parse JSON response from OpenAI API');
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
