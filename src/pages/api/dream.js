import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const summaryText = `你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语。`;

      const summaryData = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: summaryText },
          { role: 'user', content: `UserId: ${userId}` },
          { role: 'user', content: dream },
        ],
        max_tokens: 35,
        temperature: 0.9,
      };

      const summaryResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        summaryData,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const summaryCompletion = summaryResponse.data.choices[0];
      const summary =
        summaryCompletion &&
        summaryCompletion.message &&
        summaryCompletion.message.content
          ? summaryCompletion.message.content.trim()
          : '';

      console.log('summary=' + summary);

      const rolePlayText = ` `;

      const chatData = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: rolePlayText },
          { role: 'user', content: `UserId: ${userId}` },
          { role: 'user', content: summary },
        ],
        temperature: 1,
        max_tokens: 888,
        stream: true,
      };

      const chatResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        chatData,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
          responseType: 'stream', // 设置响应类型为流
        },
      );

      const answerStream = chatResponse.data;

      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Transfer-Encoding', 'chunked');

      // Send SSE events
      res.write(`event: message\n`);
      res.write(
        `data: ${JSON.stringify({
          message: 'Processing your request...',
        })}\n\n`,
      );

      for await (const chunk of answerStream) {
        res.write(`event: message\n`);
        res.write(`data: ${JSON.stringify({ message: chunk.toString() })}\n\n`);
      }

      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
