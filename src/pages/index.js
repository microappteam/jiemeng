import { useState, useEffect } from 'react';
import { Layout, ConfigProvider, Drawer, Table, Button } from 'antd';
import axios from 'axios';
import zhCN from 'antd/lib/locale/zh_CN';
import StyledComponentsRegistry from './component';
import { useSession } from 'next-auth/react';
//.
const utf8Decoder = new TextDecoder('utf-8');

export default function Home() {
  const [dream, setDream] = useState('');
  const [responseText, setResponseText] = useState('');
  const [weatherText, setWeatherText] = useState();
  const [futureWeatherText, setFutureWeatherText] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dreamData, setDreamData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    setIsHydrated(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const location = `${longitude},${latitude}`;

      try {
        const response = await fetch('/api/weather', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({ location }),
        });

        const reader = response.body.getReader();

        const process = ({ done, value: chunk }) => {
          if (done) {
            console.log('Stream finished');
            return;
          }
          const decodedChunk = new TextDecoder().decode(chunk);
          setFutureWeatherText(decodedChunk);
          if (
            decodedChunk.startsWith(
              '{"status":"1","count":"1","info":"OK","infocode":"10000","lives":[{"province"',
            )
          ) {
            setWeatherText(decodedChunk);
          }

          return reader.read().then(process);
        };

        await process(await reader.read());
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const loadingTexts = [
    'Loading...',
    '正在询问周公...',
    '正在翻阅梦书...',
    '好运正在路上...',
    'Loading 101% ...',
    '慢工出细活，久久方为功...',
    '周公正在解读梦境，请稍候...',
    '加载中，请稍候...',
    '卖力加载中...',
    'O.o ...',
    '马上就要写完咯...',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponseText('');
    let tempText = '';

    try {
      const response = await fetch('/api/dream', {
        method: 'POST',
        body: JSON.stringify({ dream }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const reader = response.body.getReader();

        const processData = ({ done, value: chunk }) => {
          if (done) {
            console.log('Stream finished');
            return;
          }
          setResponseText((responseText) => {
            return responseText + utf8Decoder.decode(chunk, { stream: true });
          });

          tempText += utf8Decoder.decode(chunk, { stream: true });

          return reader.read().then(processData);
        };

        await processData(await reader.read());

        const newDreamData = [...dreamData, { dream, response: tempText }];
        setDreamData(newDreamData);

        await axios.post(
          `/api/storage`,
          {
            dream,
            response: tempText,
            username: session?.user?.name,
          },
          { timeout: 10000 },
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (record) => {
    setDeleteLoading(true);
    const id = record.id;

    fetch(`/api/delete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status: false }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Record updated') {
          const updatedData = dreamData.filter((item) => item.id !== id);
          setDreamData(updatedData);
        }
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Layout style={{ backgroundColor: '#fffbe9' }}>
      <ConfigProvider locale={zhCN}>
        <div className="container">
          {isHydrated && (
            <StyledComponentsRegistry
              dream={dream}
              setDream={setDream}
              handleSubmit={handleSubmit}
              response={responseText}
              isLoading={isLoading}
              loadingTexts={loadingTexts}
              weatherText={weatherText}
              futureWeatherText={futureWeatherText}
              open={open}
              showDrawer={showDrawer}
              onClose={onClose}
              handleDelete={handleDelete}
              deleteLoading={deleteLoading}
              setDeleteLoading={setDeleteLoading}
            />
          )}
        </div>
      </ConfigProvider>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background-color: #fffbe9;
          overflow-y: auto;
          height: 100vh;
        }
      `}</style>
    </Layout>
  );
}
