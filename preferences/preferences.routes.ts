import { Router } from 'express';
import { preferencesController } from './preferences.controller';
import { updatePreferencesSchema } from './preferences.schema';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);
router.get('/', preferencesController.get);
router.patch('/', validate(updatePreferencesSchema), preferencesController.update);

export default router;
