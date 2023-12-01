export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const requestBody = await req.json();
      const location = requestBody.location;
      const regeoQueryUrl = `https://restapi.amap.com/v3/geocode/regeo?key=6c1146b9f46f7b3ca27878e074ffa4f2&location=${location}&extensions=base`;
      const regeoResponse = await fetch(regeoQueryUrl);
      const regeoData = await regeoResponse.json();

      if (regeoData.status === '1') {
        const adcode = regeoData.regeocode.addressComponent.adcode;

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
              const response2 = await fetch(futureWeatherUrl);
              const futureWeather = await response2.json();
              controller.enqueue(encoder.encode(JSON.stringify(futureWeather)));
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          },
        });

        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        };

        const response = new Response(stream, { headers });
        return response;
      } else {
        console.error('逆地理编码查询结果无效');
        const errorResponse = new Response(
          JSON.stringify({ message: '逆地理编码查询结果无效' }),
          { status: 500 },
        );
        return errorResponse;
      }
    } catch (error) {
      console.error('Error fetching location and weather data:', error);
      const errorResponse = new Response(
        JSON.stringify({ message: '发生错误' }),
        { status: 500 },
      );
      return errorResponse;
    }
  } else {
    const methodNotAllowedResponse = new Response({
      status: 405,
      statusText: '不允许的方法',
    });
    return methodNotAllowedResponse;
  }
}
