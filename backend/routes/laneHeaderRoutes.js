import express from 'express';
import {
  getAllLaneHeaders,
  getLaneHeaderById,
  createLaneHeader,
  updateLaneHeader
} from '../controllers/laneHeaderController.js';

const router = express.Router();

// GET /api/lane-headers
router.get('/', getAllLaneHeaders);

// GET /api/lane-headers/:id
router.get('/:id', getLaneHeaderById);

// POST /api/lane-headers
router.post('/', createLaneHeader);

// PUT /api/lane-headers/:id
router.put('/:id', updateLaneHeader);

export default router;
