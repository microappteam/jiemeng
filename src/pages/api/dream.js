import { Configuration, OpenAIApi } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import SSE from 'sse';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  timeout: 60000,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const summaryText = `你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语。`;
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

      const rolePlayText = ` `;

      const chatCompletionPromise = openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: rolePlayText },
          { role: 'user', content: `UserId: ${userId}` },
          { role: 'user', content: summary },
        ],
        temperature: 1,
        max_tokens: 888,
      });

      // 设置 SSE 响应头部
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const sse = new SSE(req, res);

      const interval = setInterval(async () => {
        try {
          const chatCompletion = await chatCompletionPromise;
          const answer = chatCompletion.data.choices[0].message.content;
          sse.send(answer);

          // 如果完成了聊天完成请求，则清除定时器并关闭 SSE 连接
          if (chatCompletionPromise.isCompleted()) {
            clearInterval(interval);
            sse.close();
          }
        } catch (error) {
          console.error(error);
          sse.send('Something went wrong');
          clearInterval(interval);
          sse.close();
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
