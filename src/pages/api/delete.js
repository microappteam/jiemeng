import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function handleDelete(req, res) {
  if (req.method === 'PUT') {
    const { id, status } = req.body;

    if (id !== undefined && status !== undefined) {
      try {
        const client = await pool.connect();
        const query = 'UPDATE dreams SET status = $1 WHERE id = $2';
        const values = [status, id];
        await client.query(query, values);

        client.release();

        res.status(200).json({ message: 'Record updated' });
      } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
