import { ChatOpenAI } from '@openai/api';
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
        temperature: 0.6,
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
        temperature: 0.7,
        max_tokens: 888,
        stream: true,
      };

      const chat = new ChatOpenAI({
        apiKey: process.env.API_KEY,
      });

      const answerStream = chat.createChatStream(chatData);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      for await (const chunk of answerStream) {
        const responseData = chunk.toString();
        const startIndex = responseData.indexOf('{"content":"');
        const endIndex = responseData.indexOf('"}', startIndex);
        const content = responseData.slice(startIndex + 12, endIndex);

        if (content && !content.includes('chatcmpl')) {
          const finishReasonIndex = responseData.indexOf(
            '"finish_reason":"stop"',
          );
          if (finishReasonIndex !== -1) {
            break;
          }

          const formattedContent = content.replace(/\\n\\n/g, '\n');

          res.write(formattedContent);

          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
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
