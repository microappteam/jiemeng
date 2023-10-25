import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required for deletion' });
    }

    try {
      const client = await pool.connect();
      const query = 'DELETE FROM dreams WHERE id = $1';
      const values = [id];
      await client.query(query, values);

      client.release();

      res.status(200).json({ message: 'Record deleted' });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
