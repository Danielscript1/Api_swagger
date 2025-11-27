import type { Router, Request, Response } from 'express';
import { SwaggerRouter, SwaggerContentType } from '../routes/swagger';
import { swagger } from '../routes/swagger';
import { schemaValidator } from '../../validation/schemaValidator';
import { LoginDTO } from '../../use-cases/credentials/credentials.dto';
import { makeCredentialsUseCase } from '../../use-cases/factories/makeCredentialsUseCase';
import { UserCredentialsInvalidError } from '../../use-cases/errors/user-credetials-invalid';

export function credentialsController(app: Router) {
  const credentialsTag = {
    name: 'Credentials',
    description: 'Endpoints relacionados a credenciais',
  };

  const route = new SwaggerRouter(swagger, '', credentialsTag);

  route
    .post('/credentials', schemaValidator.login, async (request: Request, reply: Response) => {
      const loginData = request.body as LoginDTO;

      try {
        const credentialsUseCase = makeCredentialsUseCase();

        const { token } = await credentialsUseCase.execute({
          email: loginData.email,
          password: loginData.password,
        });

        return reply.status(200).json({
          success: true,
          message: 'Autenticação realizada com sucesso',
          data: {
            token,
          },
        });
      } catch (err) {
        if (err instanceof UserCredentialsInvalidError) {
          return reply.status(401).json({
            message: err.message,
          });
        }

        throw err;
      }
    })
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
          description: 'Autenticação realizada com sucesso',
        },
        400: {
          content: SwaggerContentType.JSON,
          description: 'Dados inválidos - Erro de validação',
        },
        401: {
          content: SwaggerContentType.JSON,
          description: 'Credenciais inválidas',
        },
        500: {
          content: SwaggerContentType.JSON,
          description: 'Erro interno do servidor',
        },
      },
    });

  app.use(route.instance());
}



