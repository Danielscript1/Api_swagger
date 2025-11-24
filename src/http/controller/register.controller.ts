import type { Express } from 'express';
import { SwaggerRouter, SwaggerContentType } from '../routes/swagger';
import { swagger } from '../routes/swagger';
import { schemaValidator } from '../../validation/schemaValidator';
import { register } from '../../use-cases/register/register';

export function registerController(app: Express) {
  const credentialsTag = {
    name: 'Register',
    description: 'Endpoints relacionados a criacao novo usuario'
  };

  const route = new SwaggerRouter(swagger, '', credentialsTag);

  route
    .post('/register', schemaValidator.register, register)
    .swagger({
      summary: 'Criando usuário',
      description: 'novo  usuário criado',
      schema: {
        name: 'RegisterDTO',
        content: SwaggerContentType.JSON,
      },
      responses: {
        201: {
          content: SwaggerContentType.JSON,
          description: 'Usuário criado com sucesso'
        },
        400: {
          content: SwaggerContentType.JSON,
          description: 'Dados inválidos - Erro de validação'
        },
        409: {
          content: SwaggerContentType.JSON,
          description: 'Email já está em uso'
        },
        500: {
          content: SwaggerContentType.JSON,
          description: 'Erro interno do servidor'
        }
      }
    });


  app.use(route.instance());
}


