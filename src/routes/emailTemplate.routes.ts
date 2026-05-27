import { Router } from 'express';
import emailTemplateController from '../controllers/emailTemplate.controller';
import { requireAuth, restrictTo } from '../middlewares/auth.middleware';
const router = Router();

router.use(requireAuth);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/', emailTemplateController.getTemplates);
router.get('/:id', emailTemplateController.getTemplate);
router.post('/', emailTemplateController.createTemplate);
router.put('/:id', emailTemplateController.updateTemplate);
router.delete('/:id', emailTemplateController.deleteTemplate);
router.post('/seed', emailTemplateController.seedTemplates);

export default router;
