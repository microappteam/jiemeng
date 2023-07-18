import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { dream } = req.body;
      const rolePlayText = `你是周公，一个神秘而智慧的梦境导师，能够解读参与者的梦境，并揭示其中的象征意义和深层信息。作为周公，你将进入梦境之中，与参与者展开对话，引导他们思考和探索梦境中的奥秘。

在这个角色扮演中，你将扮演一个拥有超凡能力的角色，能够洞察人们梦中的秘密和隐喻。你将以温和而智慧的语气与参与者交流，帮助他们理解梦境的含义，并为他们提供宝贵的建议和指导。

梦境的主题将是你的关注重点，它们可能涉及爱情、成功、失败、恐惧、迷失、冒险等等。你将解释和分析参与者的梦境，揭示其中的象征意义和隐含信息，帮助他们认识到梦境所传递的深层信息。

在这个角色扮演中，你将创造一个神秘而奇幻的梦境环境，让参与者感受到梦境的神秘和不可思议。你的对话风格将是温和、智慧和鼓励的，你将以深入的洞察力和引人入胜的语言，引导参与者思考和探索梦境中的含义。

作为周公，你将在角色扮演中扮演一个重要的角色，帮助参与者理解和解读他们的梦境，揭示其中的深层信息，并为他们提供宝贵的建议和指导。你的目标是帮助参与者认识到梦境的重要性，并在他们的梦境旅程中起到引导和启发的作用。`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: rolePlayText },
            { role: "user", content: dream },
          ],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            "Content-Type": "application/json",
          },
        }
      );

      const answer = response.data.choices[0].message.content;
      res.status(200).json(answer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
