export const config = {
  runtime: 'edge',
};

async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log(data.ip);
    return data.ip;
  } catch (error) {
    console.error('Error getting user IP:', error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const userIP = await getUserIP();

    if (userIP) {
      console.log('User IP:', userIP);
      const ipQueryUrl = `https://restapi.amap.com/v3/ip?ip=${userIP}&output=json&key=6c1146b9f46f7b3ca27878e074ffa4f2`;

      try {
        const ipResponse = await fetch(ipQueryUrl);
        const ipData = await ipResponse.json();

        if (ipData.status === '1') {
          const adcode = ipData.adcode;

          const currentWeatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=6c1146b9f46f7b3ca27878e074ffa4f2&city=${adcode}`;
          const futureWeatherUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=6c1146b9f46f7b3ca27878e074ffa4f2&city=${adcode}&extensions=all`;

          const encoder = new TextEncoder();
          const stream = new ReadableStream({
            async start(controller) {
              try {
                const response1 = await fetch(currentWeatherUrl);
                const currentWeather = await response1.json();
                controller.enqueue(
                  encoder.encode(JSON.stringify(currentWeather)),
                );
                console.log('当前天气  ', currentWeather);

                const response2 = await fetch(futureWeatherUrl);
                const futureWeather = await response2.json();
                console.log('未来天气  ', futureWeather);

                controller.enqueue(
                  encoder.encode(JSON.stringify(futureWeather)),
                );
                controller.close();
              } catch (e) {
                controller.error(e);
              }
            },
          });
          return new Response(stream);
        } else {
          console.error('IP查询结果无效');
        }
      } catch (error) {
        console.error('Error fetching IP data:', error);
      }
    } else {
      const res = new Response(
        JSON.stringify({
          message: '无法获取用户IP地址',
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
      statusText: '不允许的方法',
    });
    return res;
  }
}
