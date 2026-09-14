import express from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const ridesRouter = express.Router();

ridesRouter.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'INSERT INTO rides (user_id, started_at, status) VALUES ($1, NOW(), $2) RETURNING id',
      [userId, 'active']
    );

    res.status(201).json({ rideId: result.rows[0].id });
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

ridesRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT id, started_at, ended_at, distance_meters, duration_seconds, status
       FROM rides
       WHERE user_id = $1 AND status = 'completed'
       ORDER BY started_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

ridesRouter.patch('/:id/end', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE rides 
       SET status = 'completed', 
           ended_at = NOW(),
           duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::integer,
           distance_meters = (
             SELECT ST_Length(ST_MakeLine(location::geometry ORDER BY sequence_number)::geography)
             FROM route_points
             WHERE ride_id = $1
           )
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error ending ride:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

ridesRouter.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const ride = await pool.query(
      'SELECT * FROM rides WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (ride.rows.length === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const points = await pool.query(
      `SELECT ST_AsGeoJSON(location)::json AS geometry, recorded_at, sequence_number
       FROM route_points
       WHERE ride_id = $1
       ORDER BY sequence_number ASC`,
      [id]
    );

    res.status(200).json({
      ride: ride.rows[0],
      geoJSON: {
        type: 'FeatureCollection',
        features: points.rows.map((row) => ({
          type: 'Feature',
          geometry: row.geometry,
          properties: {
            recorded_at: row.recorded_at,
            sequence_number: row.sequence_number
          }
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching ride:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default ridesRouter;