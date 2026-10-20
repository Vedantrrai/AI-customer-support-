import express from 'express';
import { ChatController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/session', ChatController.initSession);
router.post('/message', ChatController.sendMessage);
router.get('/history/:sessionId', ChatController.getHistory);
router.post('/message/:messageId/rate', ChatController.rateMessage);
router.post('/escalate', ChatController.escalateSession);
router.post('/feedback', ChatController.submitFeedback);
router.get('/sessions', ChatController.listSessions);

export default router;
