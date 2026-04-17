import { Router } from 'express';
import { promptsController } from './prompts.controller';
import {
  createVersionSchema,
  exportQuerySchema,
  listPromptsQuerySchema,
  updatePromptSchema,
} from './prompts.schema';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listPromptsQuerySchema, 'query'), promptsController.list);
router.get('/:id', promptsController.get);
router.patch('/:id', validate(updatePromptSchema), promptsController.update);
router.delete('/:id', promptsController.remove);

router.get('/:id/versions', promptsController.listVersions);
router.post(
  '/:id/versions',
  validate(createVersionSchema),
  promptsController.createVersion,
);
router.get('/:id/versions/:versionId', promptsController.getVersion);

router.get('/:id/export', validate(exportQuerySchema, 'query'), promptsController.export);

export default router;
