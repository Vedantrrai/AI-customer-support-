import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', AnalyticsController.getOverview);

export default router;
