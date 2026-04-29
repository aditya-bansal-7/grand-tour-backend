import { Router } from 'express';
import { getInterviews, scheduleInterview, deleteInterview } from '../controllers/interview.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Interview Routes
router.use(requireAuth);

router.get('/', getInterviews);
router.post('/', scheduleInterview);
router.delete('/:id', deleteInterview);

export default router;
