import express from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';

const coverageRouter = express.Router();

coverageRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT ST_AsGeoJSON(
        ST_Union(
          ST_Buffer(location::geometry, 0.0001)
        )
      )::json AS coverage
       FROM route_points rp
       JOIN rides r ON rp.ride_id = r.id
       WHERE r.user_id = $1`,
      [userId]
    );

    if (!result.rows[0].coverage) {
      return res.status(200).json({ type: 'FeatureCollection', features: [] });
    }

    res.status(200).json({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: result.rows[0].coverage,
        properties: {}
      }]
    });
  } catch (error) {
    console.error('Error fetching coverage:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default coverageRouter;