import express from 'express';
import { SettingsController } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', SettingsController.getSettings);
router.post('/', SettingsController.updateSettings);

export default router;
