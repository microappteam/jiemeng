import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  timeout: 60000,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const rolePlayText = `欢迎来到周公解梦平台！我是您的专属解梦大师。请告诉我您的梦境，我将为您提供详细解释和分析。`;
      const chatCompletionPromise = openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: rolePlayText },
          { role: "user", content: `UserId: ${userId}\n${dream}` },
        ],
        temperature: 1,
        max_tokens: 888,
      });

      // 等待异步任务完成
      const chatCompletion = await chatCompletionPromise;

      const answer = chatCompletion.data.choices[0].message.content;
      res.status(200).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
