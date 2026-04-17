import { Router } from 'express';
import { projectsController } from './projects.controller';
import {
  createProjectSchema,
  listProjectsQuerySchema,
  updateProjectSchema,
} from './projects.schema';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', validate(listProjectsQuerySchema, 'query'), projectsController.list);
router.post('/', validate(createProjectSchema), projectsController.create);
router.get('/:id', projectsController.get);
router.patch('/:id', validate(updateProjectSchema), projectsController.update);
router.delete('/:id', projectsController.remove);

export default router;
