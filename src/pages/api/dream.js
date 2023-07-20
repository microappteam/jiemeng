import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from "uuid";

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
  timeout: 45000,
});

const openai = new OpenAIApi(configuration);

const processDreamInBackground = async (dream) => {
  try {
    const userId = uuidv4();
    const rolePlayText = `你是周公，一个神秘而智慧的梦境导师，请你在单次对话中回复提供关于象征意义和可能的解释的指导，帮助人们理解梦境中隐藏的信息和暗示。`;

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: rolePlayText },
        { role: "user", content: `UserId: ${userId}\n${dream}` },
      ],
      temperature: 0.8,
      max_tokens: 150,
      timeout: 45000,
    });

    const answer = chatCompletion.data.choices[0].message.content;
    // 处理完后的逻辑，例如将结果保存到数据库或发送通知等
    console.log(answer);
  } catch (error) {
    console.error(error);
    // 处理错误的逻辑
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { dream } = req.body;
      // 调用后台任务处理函数，将任务放入后台执行
      processDreamInBackground(dream);
      // 返回立即响应
      res.status(200).json({ message: "Dream processing started" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
