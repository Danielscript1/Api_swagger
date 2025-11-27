import type { Express } from 'express';
import { publicRoutes } from './public.routes';

export async function setupRouter(app: Express) {
    const publicRouter = await publicRoutes();
    app.use('/api', publicRouter);
}