import React, { useState } from 'react';

const WeatherDisplay = ({ weatherText, futureWeatherText }) => {
  const formatWeatherText = (weatherText) => {
    console.log('weatherText:', weatherText);
    const { lives } = JSON.parse(weatherText);
    const {
      reporttime,
      city,
      weather,
      temperature,
      winddirection,
      windpower,
      humidity,
    } = lives[0];

    const formattedText = `当前天气：${reporttime}\n城市：${city}\n天气：${weather}\n温度：${temperature}°C\n风向：${winddirection}\n风力：${windpower}\n湿度：${humidity}%`;

    return formattedText;
  };

  const formatFutureWeatherText = (futureWeatherText) => {
    const { forecasts } = JSON.parse(futureWeatherText);
    const { city, casts } = forecasts[0];

    const formattedText = casts
      .map((cast) => {
        const { date, dayweather, nightweather, daywind, nightwind } = cast;
        return `日期：${date}\n白天天气：${dayweather}\n夜间天气：${nightweather}\n白天风向：${daywind}\n夜间风向：${nightwind}\n`;
      })
      .join('\n');

    return formattedText;
  };

  const [showFutureWeather, setShowFutureWeather] = useState(false);

  const handleMouseEnter = () => {
    setShowFutureWeather(true);
  };

  const handleMouseLeave = () => {
    setShowFutureWeather(false);
  };

  const formattedWeatherText = formatWeatherText(weatherText);
  const formattedFutureWeatherText = formatFutureWeatherText(futureWeatherText);

  return (
    <>
      <textarea
        value={formattedWeatherText}
        readOnly
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '320px',
          height: '160px',
          overflow: 'auto',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {showFutureWeather && (
        <textarea
          value={formattedFutureWeatherText}
          readOnly
          style={{
            position: 'fixed',
            top: '180px',
            right: '10px',
            width: '320px',
            height: '160px',
            overflow: 'auto',
          }}
        />
      )}
    </>
  );
};

export default WeatherDisplay;
