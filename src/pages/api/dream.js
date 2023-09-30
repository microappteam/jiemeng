import { Readable } from 'stream';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = await req.json();

      const userId = uuidv4();
      // const summaryText = `你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语。`;
      // const summaryData = {
      //   model: 'gpt-3.5-turbo',
      //   messages: [
      //     { role: 'system', content: summaryText },
      //     { role: 'user', content: `UserId: ${userId}` },
      //     { role: 'user', content: dream },
      //   ],
      //   max_tokens: 35,
      //   stop: ['\n', '。'],
      //   stream: false,
      //   temperature: 0.9,
      // };

      // const summaryCompletion = await openai.chat.completions.create(
      //   summaryData,
      // );

      // const summaryChoice = summaryCompletion.choices[0];

      // const summary =
      //   summaryChoice && summaryChoice.message && summaryChoice.message.content
      //     ? summaryChoice.message.content.trim()
      //     : '';

      const rolePlayText = ` 你需要将我给你的梦境进行总结，去掉一些修饰词，保留句子的谓语和宾语，并解析他`;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const chatData = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: rolePlayText },
                { role: 'user', content: `UserId: ${userId}` },
                { role: 'user', content: dream },
              ],
              temperature: 1,
              max_tokens: 888,
              stream: true,
            });
            for await (const part of chatData) {
              console.log(part.choices[0]?.delta?.content + '///');
              controller.enqueue(
                encoder.encode(part.choices[0]?.delta?.content || ''),
              );
            }
            // 完成后，关闭流
            controller.close();
          } catch (e) {
            // 如果在执行过程中发生错误，向流发送错误
            controller.error(e);
          }
        },
      });

      return new Response(stream);
    } catch (error) {
      const res = new Response(
        JSON.stringify({
          message: 'Internal server error' + error.message,
        }),
        {
          status: 500,
        },
      );
      return res;
    }
  } else {
    const res = new Response({
      status: 405,
      statusText: 'Method not allowed',
    });
    return res;
  }
}
