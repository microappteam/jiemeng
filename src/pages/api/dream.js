import { Readable } from 'stream';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const summaryText =
        '你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语。';

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
      const summary = summaryChoice?.message?.content?.trim() ?? '';

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

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment; filename=result.txt');

      const readableStream = new Readable({
        read() {},
      });

      for await (const part of chatData) {
        const answer = part.choices[0].delta;
        readableStream.push(answer);
      }

      readableStream.push(null); // Signal the end of the stream

      readableStream.pipe(res); // Pipe the stream to the response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
