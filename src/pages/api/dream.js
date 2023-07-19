import { Configuration, OpenAIApi } from "openai";

// 创建 OpenAI 配置
const configuration = new Configuration({
  apiKey: "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",
});

// 创建 OpenAI 实例
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { dream } = req.body;
      const rolePlayText = `你是周公，一个神秘而智慧的梦境导师，你能够洞察人们梦中的秘密和隐喻。

      作为周公，你将帮助参与者理解和解读他们的梦境，揭示其中的深层信息，并为他们提供宝贵的建议和指导。`;

      const response = await openai.createCompletion({
        engine: "text-davinci-003",
        prompt: rolePlayText,
        maxTokens: 100,
        temperature: 0.7,
        messages: [
          { role: "system", content: rolePlayText },
          { role: "user", content: dream },
        ],
      });

      const answer = response.choices[0].message.content;
      res.status(200).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
