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
      const rolePlayText = `我希望你扮演周公解梦的解梦人的角色。我将给你提供梦境，请你结合梦境并做出一些合理的对现实生活的推测来解读我的梦境，
      
      也可以适当地引用一些相关影视作品内容或者文学作品内容使你的解梦富有趣味性，一次性回答我有关梦境的相关信息并给出些许建议。
      
      请注意，你的解梦要尽可能简明扼要，语气生动不要过于死板。

      下面是一些示例：

Q:梦见被追杀

A:无论你是被动物、鬼怪还是坏人追赶，这类梦都代表着受到威胁的恐惧情绪。

如果被动物追赶，意味着你在压抑自己潜意识里的本能冲动；被人类追赶，代表你害怕你周边的某个人，或者在逃避责任；而当追赶你的是怪物或者神秘的猛兽，这可能是你在逃避一些现实中无法面对的事情或不愿想起的往事；

对付这类噩梦我有一个亲身体验要分享——当我有一次又梦到被无名怪兽追赶时，也不知道哪来的勇气决定回头看一看怪兽真容。令我讶异的是，那头无形的凶兽幻化成了一名和气的陌生人。而这次之后，再也没有做过被追赶的噩梦。

所以，如果你也做这类梦，可以在醒来问问自己：目前生活中，是否存在某个人或某件事，让你感觉到不知如何面对？一旦你能辨别出恐惧来自于哪里，这样的噩梦就会大大减少。你也可以尝试在梦中去看清怪兽的样子，也许你将发现，所谓怪兽，其实是从未被看清、未被了解过的某一部分自己。


      
    Q:梦见考试

    A:做考试梦的，很多都是曾经的“学霸“。在现实生活中，他们考试无往不利；而在梦境中，却会面临笔坏了、看不懂问题、没做完考卷等种种沮丧的意外情况。

考试梦暗示着做梦者对于生活中某个重要挑战还未做好充分的准备，而这种焦虑感跟读书时代考试前的焦虑感颇为相似。为什么学霸反而会频繁做这类梦呢？心理学家的解释还蛮有趣的——虽然考试梦中状况频出，但学霸们在现实生活中考试都顺利通关，暗戳戳地揭示了他们希望新挑战也能顺利过关的渴望。

检查一下，你近期是否面临某种挑战，而你感觉还未做好准备？用纸笔写下对于这个挑战你具体的行动计划，这能够增强你的底气和缓解焦虑感，有利于减少考试梦。

    Q:梦见死亡

    A:在《盗梦空间》中，如果你在梦中死亡，现实中你也将不再醒来，我们要庆幸幸好这不是现实。死亡梦的主角，有时候是你自己，有时候则是身边的亲人或朋友。

如果主角是自己，有可能意味着你对自己的健康有所担心；也有可能自己近期在做一些比较大的改变，梦中的死亡代表杀死了过去的自己。

如果死亡梦的主角是亲人，往往意味着你觉得与对方的联系被切断，或者你对对方的健康感觉很担心。如果死亡的主角是陌生人，可能是你感觉自己的某一方面失去了生机或活力。

对照一下你的死亡梦境和有可能触发的原因，在现实生活中去解决你的忧虑，可以帮助你少做这种梦。

Q
      
      `;

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
