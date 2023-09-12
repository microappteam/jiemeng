import { Configuration, OpenAIApi } from 'openai';
import { v4 as uuidv4 } from 'uuid';

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
      const summaryChoice =
        summaryCompletion.choices && summaryCompletion.choices.length > 0
          ? summaryCompletion.choices[0]
          : null;
      const summary =
        summaryChoice && summaryChoice.message && summaryChoice.message.content
          ? summaryChoice.message.content.trim()
          : '';

      console.log('summary=' + summary);

      const rolePlayText = '';

      const baseUrl = 'https://api.openai.com/v1';
      const openaiPath = 'chat/completions';
      const authValue = `Bearer ${process.env.API_KEY}`;

      const controller = new AbortController();
      const signal = controller.signal;

      const fetchUrl = `${baseUrl}/${openaiPath}`;
      const fetchOptions = {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          Authorization: authValue,
        },
        method: req.method,
        body: JSON.stringify('hello'),
        redirect: 'manual',
        signal: signal,
      };

      const fetchResponse = await fetch(fetchUrl, fetchOptions);
      console.log('fetchResponse=' + fetchResponse);
      // to prevent browser prompt for credentials
      const newHeaders = new Headers(fetchResponse.headers);
      newHeaders.delete('www-authenticate');
      // to disable nginx buffering
      newHeaders.set('X-Accel-Buffering', 'no');

      const responseBody = await fetchResponse.text();

      res.writeHead(fetchResponse.status, fetchResponse.statusText, newHeaders);
      res.write(responseBody);
      res.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
