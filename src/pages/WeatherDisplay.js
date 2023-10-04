import React, { useState } from 'react';
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaCloudShowersHeavy,
  FaSnowflake,
  FaSmog,
  FaQuestionCircle,
} from 'react-icons/fa';

const WeatherDisplay = ({ weatherText, futureWeatherText }) => {
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case '晴':
        return <FaSun />;
      case '多云':
        return <FaCloud />;
      case '小雨':
        return <FaCloudRain />;
      case '大雨':
        return <FaCloudShowersHeavy />;
      case '大雪':
        return <FaSnowflake />;
      case '雾':
        return <FaSmog />;
      default:
        return <FaQuestionCircle />;
    }
  };

  // 在 formatWeatherText 函数中使用 getWeatherIcon
  const formatWeatherText = (weatherText) => {
    try {
      const { lives } = JSON.parse(weatherText);
      const {
        reporttime,
        city,
        province,
        weather,
        temperature,
        winddirection,
        windpower,
        humidity,
      } = lives[0];

      const weatherIcon = getWeatherIcon(weather);

      const formattedText = (
        <>
          {province} {city}
          <br />
          {weatherIcon}
          <br />
          {temperature}°C
          <br />
          {winddirection}风
        </>
      );

      return formattedText;
    } catch (error) {
      console.error('Invalid weatherText JSON:', error);
      return '';
    }
  };

  const formatFutureWeatherText = (futureWeatherText) => {
    try {
      const { forecasts } = JSON.parse(futureWeatherText);
      const { city, casts } = forecasts[0];

      const formattedText = casts
        .map((cast) => {
          const { date, dayweather, nightweather, daytemp, nighttemp } = cast;
          return `日期：${date}\n白天天气：${dayweather}\n ${nighttemp} - ${daytemp}°`;
        })
        .join('\n');

      return formattedText;
    } catch (error) {
      console.error('Invalid futureWeatherText JSON:', error);
      return '';
    }
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
      <label
        htmlFor="weatherText"
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
      >
        {formattedWeatherText}
      </label>
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
