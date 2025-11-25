import type { Router } from 'express';
import { SwaggerRouter, SwaggerContentType } from '../routes/swagger';
import { swagger } from '../routes/swagger';
import { schemaValidator } from '../../validation/schemaValidator';
import { credentials } from '../../use-cases/credentials/credentials';


export async function credentialsController(app: Router) {
  const credentialsTag = {
    name: 'Credentials',
    description: 'Endpoints relacionados a credenciais'
  };

  const route = new SwaggerRouter(swagger, '', credentialsTag, '/api');

  route
    .post('/credentials', schemaValidator.login, credentials)
    .swagger({
      summary: 'Autenticar usuário',
      description: 'Autentica um usuário usando email e senha',
      schema: {
        name: 'LoginDTO',
        content: SwaggerContentType.JSON,
      },
      responses: {
        200: {
          content: SwaggerContentType.JSON,
          description: 'Autenticação realizada com sucesso'
        },
        400: {
          content: SwaggerContentType.JSON,
          description: 'Dados inválidos - Erro de validação'
        },
        500: {
          content: SwaggerContentType.JSON,
          description: 'Erro interno do servidor'
        }
      }
    });


  app.use(route.instance());
}



