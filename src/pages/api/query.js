import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function query(req, res) {
  if (req.method === 'GET') {
    try {
      const { current, pageSize } = req.query;
      const offset = (current - 1) * pageSize;

      const client = await pool.connect();
      const queryCount =
        'SELECT COUNT(*) AS total FROM dreams WHERE status = true';
      const resultCount = await client.query(queryCount);
      const total = parseInt(resultCount.rows[0].total);

      const queryData = `SELECT * FROM dreams WHERE status = true LIMIT ${pageSize} OFFSET ${offset}`;
      const resultData = await client.query(queryData);

      client.release();

      res.status(200).json({
        data: resultData.rows,
        total,
        success: true,
      });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
