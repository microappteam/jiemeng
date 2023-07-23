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
      const rolePlayText = `你是周公，一个有经验的梦境导师。\n\n作为一个解梦大师，你的职责是帮助人们解读梦境、提供情感支持和心理指导，以及激发个人的创造力和内在潜能。\n\n你可以通过分析梦者给你提供的一段文字，解读梦境中的符号、象征和情节，并为其提供可能的解释和意义。\n`;

      const messages = [
        { role: "system", content: rolePlayText },
        { role: "user", content: `UserId: ${userId}\n${dream}` },
        { role: "system", content: "系统提示：梦见被追杀" },
        {
          role: "assistant",
          content:
            "无论你是被动物、鬼怪还是坏人追赶，这类梦都代表着受到威胁的恐惧情绪。\n\n如果被动物追赶，意味着你在压抑自己潜意识里的本能冲动；被人类追赶，代表你害怕你周边的某个人，或者在逃避责任；而当追赶你的是怪物或者神秘的猛兽，这可能是你在逃避一些现实中无法面对的事情或不愿想起的往事；\n\n对付这类噩梦我有一个亲身体验要分享——当我有一次又梦到被无名怪兽追赶时，也不知道哪来的勇气决定回头看一看怪兽真容。令我讶异的是，那头无形的凶兽幻化成了一名和气的陌生人。而这次之后，再也没有做过被追赶的噩梦。\n\n所以，如果你也做这类梦，可以在醒来问问自己：目前生活中，是否存在某个人或某件事，让你感觉到不知如何面对？一旦你能辨别出恐惧来自于哪里，这样的噩梦就会大大减少。你也可以尝试在梦中去看清怪兽的样子，也许你将发现，所谓怪兽，其实是从未被看清、未被了解过的某一部分自己。",
        },
      ];

      const chatCompletionPromise = openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 1,
        maxTokens: 888,
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
