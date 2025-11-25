import type { Express } from 'express';
import { publicRoutes } from './public.routes';
import { swagger, SwaggerPage } from './swagger';

export async function setupRouter(app:Express){
    const publicRouter = await publicRoutes();
    app.use('/api', publicRouter);

    SwaggerPage.generate(app, '/api-docs', [
        {
            doc: {
                link: '/api-docs/swagger',
                title: 'API Principal',
                description: 'Documentação completa da API do Backend'
            },
            swagger: swagger
        }
    ]);
}