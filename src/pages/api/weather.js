export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          console.log('您的纬度是: ' + latitude);
          console.log('您的经度是: ' + longitude);
        });
      } else {
        console.log('浏览器不支持地理位置信息获取');
      }
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const response1 = await fetch(
              'https://restapi.amap.com/v3/weather/weatherInfo?key=6c1146b9f46f7b3ca27878e074ffa4f2&city=320102',
            );

            const currentWeather = await response1.json();

            controller.enqueue(encoder.encode(JSON.stringify(currentWeather)));

            const response2 = await fetch(
              'https://restapi.amap.com/v3/weather/weatherInfo?key=6c1146b9f46f7b3ca27878e074ffa4f2&city=320102&extensions=all',
            );

            const futureWeather = await response2.json();

            controller.enqueue(encoder.encode(JSON.stringify(futureWeather)));

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
