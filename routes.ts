import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import projectsRoutes from './modules/projects/projects.routes';
import promptsRoutes from './modules/prompts/prompts.routes';
import templatesRoutes from './modules/templates/templates.routes';
import sessionsRoutes from './modules/sessions/sessions.routes';
import preferencesRoutes from './modules/preferences/preferences.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), ts: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);
router.use('/prompts', promptsRoutes);
router.use('/templates', templatesRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/preferences', preferencesRoutes);

export default router;
