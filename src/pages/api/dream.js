import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { insertedRow } from './storage';
import crypto from 'crypto-browserify'; // 引入 crypto-browserify
import { TextEncoder } from 'util'; // 使用 util 包中的 TextEncoder
import { ReadableStream, Response } from 'web-streams-polyfill/ponyfill'; // 使用 web-streams-polyfill

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
      const rolePlayText = ` `;
      const encoder = new TextEncoder('utf-8'); // 使用 TextEncoder 时，指定字符编码
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
            insertedRow({
              dream,
              response: chatData,
              username: userId,
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
      const response = new Response( // 使用不同的变量名以防止命名冲突
        JSON.stringify({
          message: 'Internal server error' + error.message,
        }),
        {
          status: 500,
        },
      );
      return response;
    }
  } else {
    const response = new Response({
      status: 405,
      statusText: 'Method not allowed',
    });
    return response;
  }
}
