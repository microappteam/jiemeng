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
      // 使用 TextEncoder 将字符串转换为字节数组，以便在 ReadableStream 中发送
      const encoder = new TextEncoder();

      // 初始化换行符计数器

      return new ReadableStream({
        async start(controller) {
          let newlineCounter = 0;

          const chat = new ChatOpenAI({
            streaming: true,
            ...params,
            // 暂时设定不重试 ，后续看是否需要支持重试
            maxRetries: 0,
            callbacks: [
              {
                handleLLMNewToken(token) {
                  // 如果 message 是换行符，且 newlineCounter 小于 2，那么跳过该换行符
                  if (newlineCounter < 2 && token === '\n') {
                    return;
                  }

                  // 将 message 编码为字节并添加到流中
                  const queue = encoder.encode(token);
                  controller.enqueue(queue);
                  newlineCounter++;
                },
              },
            ],
          });

          try {
            // 使用转换后的聊天消息作为输入开始聊天
            await chat.call(chatData);
            // 完成后，关闭流
            controller.close();
            res.json({ success: true });
          } catch (e) {
            // 如果在执行过程中发生错误，向流发送错误
            controller.error(e);
          }
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
