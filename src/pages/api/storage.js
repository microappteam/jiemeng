import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dream, response, username } = req.body;

    try {
      const client = await pool.connect();
      const query =
        'INSERT INTO dreams (dream, response, username) VALUES ($1, $2, $3) RETURNING *';
      const values = [dream, response, username];
      const result = await client.query(query, values);
      client.release();

      console.log('Inserted row:', result.rows[0]); // 添加这行调试语句

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
