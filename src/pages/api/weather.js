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

            const forecasts = data.forecasts;
            if (forecasts && forecasts.length > 0) {
              const firstForecast = forecasts[0].casts.find(
                (forecast) => forecast.week === '1',
              );
              if (firstForecast) {
                controller.enqueue(
                  encoder.encode(JSON.stringify(firstForecast)),
                );
              }
            }
            console.log('data=  ', data);

            // 完成后，关闭流
            controller.close();
          } catch (e) {
            // 如果在执行过程中发生错误，向流发送错误
            controller.error(e);
          }
        },
      });
      console.log(stream);

      if (stream instanceof ReadableStream) {
        console.log('API 返回的数据是流');
        // 进行流处理操作
      } else {
        console.log('API 返回的数据不是流');
        // 处理非流数据
      }
      console.log('stream=', stream);
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
