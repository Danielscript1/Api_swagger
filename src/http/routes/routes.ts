import type { Express } from 'express';
import { swagger, SwaggerPage } from './swagger';
import 'reflect-metadata';
import '../../use-cases/credentials/credentials.dto';
import { credentialsController, registerController } from '../controller';


export async function privateRoutes(app: Express) {
  
  credentialsController(app);
  registerController(app)

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

export const routes = {
    ...privateRoutes
} 