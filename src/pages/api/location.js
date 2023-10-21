async function getLocationAdcode(location) {
  const apiKey = '6c1146b9f46f7b3ca27878e074ffa4f2';
  const regeoQueryUrl = `https://restapi.amap.com/v3/geocode/regeo?key=${apiKey}&location=${location}&extensions=base`;

  try {
    const regeoResponse = await fetch(regeoQueryUrl);
    const regeoData = await regeoResponse.json();

    if (regeoData.status === '1') {
      const adcode = regeoData.regeocode.addressComponent.adcode;
      return adcode;
    } else {
      // 处理错误情况，可以返回一个默认值或者抛出异常
      return null;
    }
  } catch (error) {
    // 处理网络请求错误
    console.error('获取adcode时出错：', error);
    return null;
  }
}
