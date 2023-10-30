import { Drawer, Spin } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import React from 'react';

const DreamHistoryDrawer = ({
  open,
  showDrawer,
  onClose,
  handleDelete,
  dreamData,
  deleteLoading,
}) => {
  const params = {
    pageSize: 10,
    current: 1,
  };
  const filteredData = dreamData.filter((item) => item.status === true);
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
                render: (_, record, index, action) => {
                  if (record.status === true) {
                    return (
                      <span>
                        {deleteLoading ? (
                          <Spin size="small" />
                        ) : (
                          <a
                            key="delete"
                            onClick={() => handleDelete(record)}
                            style={{ cursor: 'pointer' }}
                          >
                            删除
                          </a>
                        )}
                      </span>
                    );
                  }
                  return null;
                },
              },
            ]}
            rowKey="id"
            dataSource={filteredData}
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
