import { Router } from 'express';
import { sessionsController } from './sessions.controller';
import {
  completeSessionSchema,
  createSessionSchema,
  previewSchema,
  updateSessionSchema,
} from './sessions.schema';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/preview', validate(previewSchema), sessionsController.preview);

router.get('/', sessionsController.list);
router.post('/', validate(createSessionSchema), sessionsController.create);
router.get('/:id', sessionsController.get);
router.patch('/:id', validate(updateSessionSchema), sessionsController.update);
router.delete('/:id', sessionsController.remove);
router.post('/:id/complete', validate(completeSessionSchema), sessionsController.complete);

export default router;
