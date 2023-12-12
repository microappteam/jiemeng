import { Pool } from 'pg';
import querystring from 'querystring';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function query(req, res) {
  if (req.method === 'GET') {
    try {
      const parsedUrl = req.url.split('?'); // 分离路径和查询参数部分
      const queryParameters = parsedUrl[1]; // 获取查询字符串部分

      const queryParamsObject = querystring.parse(queryParameters); // 使用 querystring 解析查询参数

      const { current, pageSize, dream, response } = queryParamsObject;
      const parsedCurrent = parseInt(current, 10);
      const parsedPageSize = parseInt(pageSize, 10);

      if (isNaN(parsedCurrent) || isNaN(parsedPageSize)) {
        throw new Error(
          'Invalid parameters: current and pageSize must be numbers',
        );
      }

      const client = await pool.connect();

      let filterQuery = 'WHERE status = true';

      if (dream) {
        filterQuery += ` AND dream ILIKE '%${dream}%'`;
      }

      if (response) {
        filterQuery += ` AND response ILIKE '%${response}%'`;
      }

      const queryCount = `SELECT COUNT(*) AS total FROM dreams ${filterQuery}`;
      const resultCount = await client.query(queryCount);
      const total = parseInt(resultCount.rows[0].total);

      const offset = (parsedCurrent - 1) * parsedPageSize;
      const queryData = `SELECT * FROM dreams ${filterQuery} LIMIT ${parsedPageSize} OFFSET ${offset}`;
      const resultData = await client.query(queryData);

      client.release();

      res.status(200).json({
        data: resultData.rows,
        total,
        success: true,
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
