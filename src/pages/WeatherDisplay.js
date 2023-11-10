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
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
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

  const formatWeatherText = (weatherText) => {
    try {
      if (!weatherText) {
        return '';
      }

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
          {city}
          <span style={{ margin: '0 5px' }}></span>
          {temperature}°C
          <span style={{ margin: '0 5px' }}></span>
          {weatherIcon}
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
      if (!futureWeatherText) {
        return '';
      }

      const parsedData = JSON.parse(futureWeatherText);

      if (
        parsedData &&
        parsedData.forecasts &&
        parsedData.forecasts.length > 0
      ) {
        const { city, casts } = parsedData.forecasts[0];

        const formattedText = casts.slice(1).map((cast, index) => {
          const { dayweather, nightweather, daytemp, nighttemp } = cast;

          const today = new Date();
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + index + 1);

          let dateDescription;
          switch (index + 1) {
            case 1:
              dateDescription = '明天';
              break;
            case 2:
              dateDescription = '后天';
              break;
            case 3:
              dateDescription = '大后天';
              break;
            default:
              dateDescription = `${
                futureDate.getMonth() + 1
              }/${futureDate.getDate()}`;
              break;
          }
          const dayWeatherIcon = getWeatherIcon(dayweather);
          return (
            <div key={index}>
              <div>{dateDescription}</div>

              <div>{dayWeatherIcon}</div>

              <div>{dayweather}</div>
              <div>{`${nighttemp} - ${daytemp}°`}</div>
            </div>
          );
        });

        return formattedText;
      } else {
        return '';
      }
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
  const [tomorrow, dayaftertomorrow, thedayaftertomorrow] =
    formattedFutureWeatherText;

  return (
    <>
      <label
        htmlFor="weatherText"
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '200px',
          height: '40px',
          overflow: 'auto',
          border: 'none',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          color: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {formattedWeatherText ? (
          formattedWeatherText
        ) : (
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                spin
              />
            }
          />
        )}
      </label>

      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: showFutureWeather ? '60px' : '160px',
          right: '10px',
          width: '200px',
          height: '100px',
          overflow: 'auto',
          border: 'none',
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          opacity: showFutureWeather ? 1 : 0,
          transition: 'top 0.3s, opacity 0.3s',
          color: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {tomorrow ? (
          <div style={{ flex: 1 }}>{tomorrow}</div>
        ) : (
          <div style={{ flex: 1 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                  spin
                />
              }
            />
          </div>
        )}
        {dayaftertomorrow ? (
          <div style={{ flex: 1 }}>{dayaftertomorrow}</div>
        ) : (
          <div style={{ flex: 1 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                  spin
                />
              }
            />
          </div>
        )}
        {thedayaftertomorrow ? (
          <div style={{ flex: 1 }}>{thedayaftertomorrow}</div>
        ) : (
          <div style={{ flex: 1 }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: 'rgba(0,0,0,0.65)' }}
                  spin
                />
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherDisplay;
