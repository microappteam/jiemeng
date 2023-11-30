import { Drawer, Spin } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useRef } from 'react';
const DreamHistoryDrawer = ({ open, showDrawer, onClose, handleDelete }) => {
  const actionRef = useRef();
  return (
    <div>
      <>
        <Drawer
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button className="close-button" onClick={onClose}>
                返回
              </button>
            </div>
          }
          placement="right"
          closable={false}
          onClose={onClose}
          open={open}
          width={1300}
          forceRender={true}
        >
          <ProTable
            request={async (params) => {
              const { current, pageSize } = params;

              const response = await fetch(
                `/api/query?current=${current}&pageSize=${pageSize}`,
                {
                  method: 'GET',
                },
              );

              const responseData = await response.json();

              return {
                data: responseData.data,
                success: responseData.success,
                total: responseData.total,
              };
            }}
            actionRef={actionRef}
            columns={[
              {
                title: '梦境',
                dataIndex: 'dream',
                key: 'dream',
                width: 250,
              },
              {
                title: '解梦结果',
                dataIndex: 'response',
                key: 'response',
                width: 1000,
              },
              {
                title: '操作',
                valueType: 'option',
                width: 75,
                render: (_, record, index, action) => {
                  if (record.status === true) {
                    return (
                      <span>
                        {record.loading ? (
                          <Spin
                            indicator={
                              <LoadingOutlined
                                style={{
                                  fontSize: 16,
                                  color: 'rgba(0,0,0,0.65)',
                                }}
                                spin
                              />
                            }
                          />
                        ) : (
                          <a
                            key="delete"
                            onClick={() => {
                              record.loading = true;
                              handleDelete(record);
                              actionRef.current?.reload();
                            }}
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
              {},
            ]}
            rowKey="id"
            pagination={{
              defaultPageSize: 7,
            }}
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

        .close-button {
          padding: 8px 16px;
          background-color: #ffffff;
          color: #333333;
          border: 1px solid #cccccc;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .history-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default DreamHistoryDrawer;
