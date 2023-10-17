import { Polyfill } from 'crypto-browserify';

// 设置 'crypto' 模块为 'crypto-browserify' 的 Polyfill
globalThis.crypto = Polyfill;

import { Pool } from 'pg';
import moment from 'moment-timezone';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export const insertRow = async (body) => {
  const { dream, response, username } = body;

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

  return result.rows[0];
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dream, response, username } = req.body;
    if (!dream || !response)
      return res.status(200).json({
        message: 'Dream or response is empty',
      });
    try {
      const insertedRow = await insertRow({ dream, response, username });
      res.status(200).json(insertedRow);
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
  } else if (req.method === 'DELETE') {
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
