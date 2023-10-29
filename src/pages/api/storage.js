import { Pool } from 'pg';
import moment from 'moment-timezone';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dream, response, username } = req.body;

    console.log('Received data:', dream, response, username);
    try {
      const client = await pool.connect();
      const query =
        'INSERT INTO dreams (dream, response, username, created_at) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [
        dream,
        response,
        username,
        moment().tz('Asia/Shanghai').format(),
      ];
      const result = await client.query(query, values);

      client.release();

      console.log('Inserted row:', result.rows[0]);

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
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
  } else if (req.method === 'PUT') {
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
    } else {
      res.status(400).json({ error: 'ID and status are required for update' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
