import { Readable } from 'stream';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
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
        stop: ['\n', '。'],
        temperature: 0.9,
      };

      const summaryCompletion = await openai.chat.completions.create(
        summaryData,
        {
          stream: false,
        },
      );

      const summaryChoice = summaryCompletion.choices[0];

      const summary =
        summaryChoice && summaryChoice.message && summaryChoice.message.content
          ? summaryChoice.message.content.trim()
          : '';

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

      const readableStream = new Readable({
        async read() {
          try {
            for await (const part of chatData) {
              const answer = JSON.stringify(part.choices[0].delta);
              console.log(answer);
              this.push(answer);
            }
            this.push(null);
          } catch (error) {
            console.error(error);
            this.emit('error', error);
          }
        },
      });

      return new Response(readableStream);
    } catch (error) {
      console.error(error);
      const res = new Response();
      res.status = 500;
      res.body = 'Internal server error' + error.message;
      return res;
    }
  } else {
    const res = new Response();
    res.status(405).json({ error: 'Method not allowed' });
  }
}
