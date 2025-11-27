import { Router } from 'express';
import { swagger, SwaggerPage } from './swagger';
import 'reflect-metadata';
import '../../use-cases/credentials/credentials.dto';
import '../../use-cases/register/register.dto';
import { credentialsController, registerController } from '../controller';


export async function publicRoutes() {
  const publicRouter = Router();
  
  credentialsController(publicRouter);
  registerController(publicRouter);

  SwaggerPage.generate(publicRouter, '/api-docs', [
    {
      doc: {
        link: '/api/api-docs/swagger',
        title: 'API Principal',
        description: 'Documentação completa da API do Backend'
      },
      swagger: swagger
    }
  ]);

  return publicRouter;
}

