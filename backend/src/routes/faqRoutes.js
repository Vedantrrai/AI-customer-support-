import express from 'express';
import { FaqController } from '../controllers/faqController.js';

const router = express.Router();

router.get('/', FaqController.getAll);
router.post('/', FaqController.create);
router.post('/test-match', FaqController.testMatch);
router.get('/:id', FaqController.getById);
router.put('/:id', FaqController.update);
router.delete('/:id', FaqController.delete);

export default router;
