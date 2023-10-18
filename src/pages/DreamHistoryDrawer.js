import { Drawer, Table } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import React from 'react';

const DreamHistoryDrawer = ({
  open,
  showDrawer,
  onClose,
  dreamHistory,
  handleDelete,
}) => {
  const params = {
    pageSize: 10,
    current: 1,
  };

  return (
    <div>
      <>
        <Drawer
          title="解梦记录"
          placement="right"
          closable={false}
          onClose={onClose}
          open={open}
          width={1200}
        >
          <ProTable
            params={params}
            request={async (params) => {
              const msg = await fetch('/api/storage', { method: 'GET' });
              return {
                data: msg,
                success: true,
              };
            }}
            columns={[
              {
                title: '梦境',
                dataIndex: 'dream',
                key: 'dream',
              },
              {
                title: '解梦结果',
                dataIndex: 'response',
                key: 'response',
              },
              {
                title: '操作',
                valueType: 'option',
                render: (_, record, index, action) => [
                  <a key="delete" onClick={() => handleDelete(index)}>
                    删除
                  </a>,
                ],
              },
            ]}
            dataSource={dreamHistory}
            rowKey="dream"
          />
        </Drawer>
        <button className="history-button" onClick={showDrawer}>
          历史
        </button>
      </>
      <style jsx>{`
        .history-button {
          position: absolute;
          top: 10px;
          right: 240px;
          height: 40px;
          padding: 10px 20px;
          background-color: rgba(255, 255, 255, 0.6);
          color: rgba(0, 0, 0, 0.75);
          border: none;
          border-radius: 4px;
          cursor: pointer;

          transition: background-color 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .history-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default DreamHistoryDrawer;
