import express from 'express';
import { TicketController } from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', TicketController.getAll);
router.get('/:id', TicketController.getById);
router.post('/:id/assign', TicketController.assign);
router.post('/:id/reply', TicketController.reply);
router.post('/:id/resolve', TicketController.resolve);

export default router;
