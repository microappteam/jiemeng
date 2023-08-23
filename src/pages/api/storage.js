import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  try {
    await client.connect();

    const { dream, username, response } = req.body;

    const query = `
      INSERT INTO dreams (dream, username, response)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [dream, username, response];

    const result = await client.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to store data.' });
  } finally {
    await client.end();
  }
}
