import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function query(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const query = 'SELECT * FROM dreams';
      const result = await client.query(query);

      client.release();

      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
