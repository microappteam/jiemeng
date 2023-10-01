export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response = await fetch(
              'https://restapi.amap.com/v3/weather/weatherInfo?key=6c1146b9f46f7b3ca27878e074ffa4f2&city=310000&extensions=all',
            );
            const data = await response.json();

            for (const part of data) {
              console.log(part.choices[0]?.delta?.content + '///');
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
