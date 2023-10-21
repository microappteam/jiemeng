export const config = {
  runtime: 'edge',
};

async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          console.error('Error getting user location:', error);
          reject(error);
        },
      );
    } else {
      console.error('Geolocation is not available in this browser.');
      reject('Geolocation not available');
    }
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const userLocation = await getUserLocation();

      const location = `${userLocation.longitude},${userLocation.latitude}`;
      console.log('User Location:', location);

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
              console.log('当前天气  ', currentWeather);

              const response2 = await fetch(futureWeatherUrl);
              const futureWeather = await response2.json();
              console.log('未来天气  ', futureWeather);

              controller.enqueue(encoder.encode(JSON.stringify(futureWeather)));
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          },
        });
        return new Response(stream);
      } else {
        console.error('逆地理编码查询结果无效');
      }
    } catch (error) {
      console.error('Error fetching location and weather data:', error);
    }

    // 如果发生任何错误，返回适当的错误响应
    const res = new Response(
      JSON.stringify({
        message: '发生错误',
      }),
      {
        status: 500,
      },
    );
    return res;
  } else {
    const res = new Response({
      status: 405,
      statusText: '不允许的方法',
    });
    return res;
  }
}
