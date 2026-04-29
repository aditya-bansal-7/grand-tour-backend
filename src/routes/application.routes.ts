import { Router } from 'express';
import { createApplication, getApplications, updateStatus, updateNotes, updateStep, deleteApplication } from '../controllers/application.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Application Routes
router.use(requireAuth);

router.get('/', getApplications);
router.post('/', createApplication);
router.patch('/:id/status', updateStatus);
router.patch('/:id/notes', updateNotes);
router.patch('/:id/step', updateStep);
router.delete('/:id', deleteApplication);

export default router;
