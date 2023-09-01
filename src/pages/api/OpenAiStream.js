import { Configuration, OpenAIApi } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { v4 as uuidv4 } from 'uuid';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export const runtime = 'edge';

const userId = uuidv4();

const rolePlayText = ``;

const summary = '给我讲个笑话';
export default async function POST(req) {
  const { prompt } = await req.json();
  // Create a completion using OpenAI
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: rolePlayText },
      { role: 'user', content: `UserId: ${userId}` },
      { role: 'user', content: summary },
    ],
    temperature: 1,
    max_tokens: 888,
  });

  // Transform the response into a readable stream
  const stream = OpenAIStream(response);

  // Return a StreamingTextResponse, which can be consumed by the client
  return new StreamingTextResponse(stream);
}
