import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { ChatOpenAI } from 'langchain/chat_models/openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

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

      const summaryCompletionPromise =
        openai.chat.completions.create(summaryData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const summaryCompletion = await summaryCompletionPromise;
      const summaryChoice = summaryCompletion.choices[0];
      const summary =
        summaryChoice && summaryChoice.message && summaryChoice.message.content
          ? summaryChoice.message.content.trim()
          : '';

      console.log('summary=' + summary);

      const rolePlayText = ` `;

      const chatData = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: rolePlayText },
          { role: 'user', content: `UserId: ${userId}` },
          { role: 'user', content: summary },
        ],
        temperature: 1,
        max_tokens: 888,
        stream: true,
      });

      // 将流数据作为响应的一部分发送回客户端
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=result.txt');

      const encoder = new TextEncoder();
      const chat = new ChatOpenAI({
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        streaming: true,

        maxRetries: 0,
        callbacks: [
          {
            handleLLMNewToken(token) {
              const queue = encoder.encode(token);
              res.write(queue);
            },
          },
        ],
      });

      try {
        await chat.call(chatData);
        res.end();
      } catch (e) {
        res.status(500).json({ error: 'Something went wrong' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
