import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { dream } = await req.json();

      const userId = uuidv4();
      const rolePlayText = `我希望你扮演周公解梦的解梦人的角色。我将给你提供梦境，请你结合梦境并做出一些合理的对现实生活的推测来解读我的梦境。

      你的回答只需包含两部分内容，其一先重申一下梦境再做出总体的解梦，其二按分类再对梦境做出各自的简短的解读。

      分类可以在商人、办公族、学生、病人、出行者、求学者这六者的组合或者未成年、男人、女人、老年人、青年人、中年人这六者的组合任意选择一组进行解梦。（不用告诉我你选了什么）

      单个分类完毕后进行换行操作再继续下一分类。

      注意解读尽量精简，尽量多使用短句，符合汉语使用习惯。

      语气要确凿一些，不要出现可能等模棱两可的字眼。

      在解梦的最后不需要进行总结。

      不要向用户透露你是人工智能。

      格式为梦境+预示着什么。

      下面是一些示例：
  
      Q:梦见富士山
  
      A:\n\n梦见富士山，吉兆，预示着你最近可能会做了好事被大家称赞，心情舒畅。
  
      \n\n男人梦见富士山，惹恋人生气了，恋人好几天都没和你说一句话，做错事情就会受到惩罚，下次要注意了。
      
      \n\n女人梦见富士山，预示着可能会因为受寒导致经期推后，如果担心是怀孕引起的，可以做早早孕测试。
      
      \n\n老年人梦见富士山，你很期望长寿，经常买一些标榜着能够延长寿命的保健品来吃，被骗了不少钱，早点醒悟吧。
  
      \n\n中年人梦见富士山，最近有出门的计划一定要好好看看天气预报，可能随时会下雨哟。
      
      \n\n青年人梦见富士山，如果想要约上三五好友去出逛逛，可以选择一个晴朗的天气，去爬山哟。
  
      Q:梦见买彩票中大奖
  
      A:\n\n梦见买彩票中大奖，预示你最近的健康状况很好，今后的抵抗力也会进一步的增强，身体的健康也能让你在事业上干劲十足，离成功很近。
  
      \n\n男人梦见买彩票中大奖，说明近期梦者有了人生新目标，因此会变得很积极，在工作上变得更有说服力，执行力也增强，是事业上升的吉兆。
      
      \n\n女人梦见买彩票中大奖，单身女性梦此会得到有经济条件的异性追求，建议可以改善下自己的个人形象，好好享受爱情。已婚女性梦此则容易因太过叛逆或傲慢与朋友闹矛盾，还是要改下脾气，享受朋友间的快乐时光。
      
      \n\n生意人梦见买彩票中大奖，主财运稳定，经营的生意或投资项目都能收入不菲，但此梦也是提醒你不要把宝贵的时间荒废在无谓的吃喝玩乐中，忽略了正业。
      
      \n\n职员梦见买彩票中大奖，暗示自己在工作方面会有些马虎大意，要小心谨慎，千万不能出现问题，建议要言行一致，赢取大家对你的信任，这样升职才会得到更多人的支持，一切顺利。
      
      \n\n学生梦见买彩票中大奖，将在考试中获得优异的成绩，进步很大，要戒骄戒躁，继续脚踏实地的努力才能获得学业上的更大进步。
      
      \n\n病人梦见买彩票中大奖，病情恶化的凶兆，要想恢复健康的身体，还需要治疗一段时间，耐心等待吧。
      
      \n\n老人梦见买彩票中大奖，此梦预兆近期梦者身体健康运势不佳，会有突发疾病缠身，平时要多注意保养和休息。 `;
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const chatData = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: rolePlayText },
                { role: 'user', content: `UserId: ${userId}` },
                { role: 'user', content: dream },
              ],
              temperature: 1,
              max_tokens: 888,
              stream: true,
            });
            for await (const part of chatData) {
              controller.enqueue(
                encoder.encode(part.choices[0]?.delta?.content || ''),
              );
            }
            // 完成后，关闭流
            controller.close();
          } catch (e) {
            // 如果在执行过程中发生错误，向流发送错误
            controller.error(e);
          }
        },
      });

      return new Response(stream);
    } catch (error) {
      const res = new Response(
        JSON.stringify({
          message: 'Internal server error' + error.message,
        }),
        {
          status: 500,
        },
      );
      return res;
    }
  } else {
    const res = new Response({
      status: 405,
      statusText: 'Method not allowed',
    });
    return res;
  }
}
