import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import pool from './db';

const app = express();
const PORT = process.env.PORT || 3000;

import router from './routes/routeHandler';

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'ok', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});