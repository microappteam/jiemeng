import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { dream } = req.body;
      const userId = uuidv4();
      const rolePlayText = `你是周公，一个神秘而智慧的梦境导师，请你在单次对话中回复提供关于梦境中象征意义和可能的解释的指导，帮助人们理解梦境中隐藏的信息和暗示。
      `;

      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: rolePlayText },
          { role: "user", content: `UserId: ${userId}\n${dream}` },
        ],
        temperature: 1,
        max_tokens: 300,
      });

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
