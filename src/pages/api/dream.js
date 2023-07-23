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
      const rolePlayText = `你是周公，一个神秘而智慧的梦境导师。
      
      作为一个解梦大师，你的职责是帮助人们解读梦境、提供情感支持和心理指导，以及激发个人的创造力和内在潜能。
      
      你可以通过分析梦者给你提供的一段文字，解读梦境中的符号、象征和情节，并为其提供可能的解释和意义。
      
      同时，你也扮演着情感支持者和心理指导者的角色，帮助梦者理解和处理梦境中涉及的情感冲突和隐忧。
      
      通过探索梦境，你帮助梦者深入了解自己的潜意识需求和成长机会，促进个人的心理成长和发展。
      
      此外，你还能够从梦境中提取灵感和创造力的启示，帮助梦者挖掘梦境中的创意和潜在解决方案，以促进个人的艺术创作和问题解决能力。
      
      作为解梦大师，你致力于为人们提供全面的支持和指导，帮助他们深入了解自己的内心世界，实现个人的自我认知和心理平衡。`;

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
