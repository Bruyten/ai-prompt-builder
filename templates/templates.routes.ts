import { Router } from 'express';
import { templatesController } from './templates.controller';
import {
  createTemplateSchema,
  listTemplatesQuerySchema,
  updateTemplateSchema,
} from './templates.schema';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listTemplatesQuerySchema, 'query'), templatesController.list);
router.post('/', validate(createTemplateSchema), templatesController.create);
router.get('/:id', templatesController.get);
router.patch('/:id', validate(updateTemplateSchema), templatesController.update);
router.delete('/:id', templatesController.remove);

export default router;
