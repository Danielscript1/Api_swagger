import type { Router, Request, Response } from 'express';
import { SwaggerRouter, SwaggerContentType } from '../routes/swagger';
import { swagger } from '../routes/swagger';
import { schemaValidator } from '../../validation/schemaValidator';
import { RegisterDTO } from '../../use-cases/register/register.dto';
import { makeRegisterUseCase } from '../../use-cases/factories/makeRegisterUseCase';
import { UserAlreadyExistsError } from '../../use-cases/errors/users-alredy-exisits-error';
import { checkSignupRateLimit } from '../../infra/utils/checkSignupRateLimit';

export function registerController(app: Router) {
  const registerTag = {
    name: 'Register',
    description: 'Endpoints relacionados a criação de novo usuário',
  };

  const route = new SwaggerRouter(swagger, '', registerTag);

  route
    .post('/register', schemaValidator.register, async (request: Request, reply: Response) => {
      const user = request.body as RegisterDTO;

      try {
        await checkSignupRateLimit(request);

        const registerUseCase = makeRegisterUseCase();

        const { user: createdUser } = await registerUseCase.execute({
          name: user.name,
          email: user.email,
          password: user.password,
          document: user.document,
          phone: user.phone,
        });

        return reply.status(201).json({
          message: 'user created',
          user: createdUser,
        });
      } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
          return reply.status(409).json({
            message: err.message,
          });
        }

        throw err;
      }
    })
    .swagger({
      summary: 'Criar usuário',
      description: 'Cria um novo usuário no sistema',
      schema: {
        name: 'RegisterDTO',
        content: SwaggerContentType.JSON,
      },
      responses: {
        201: {
          content: SwaggerContentType.JSON,
          description: 'Usuário criado com sucesso',
        },
        400: {
          content: SwaggerContentType.JSON,
          description: 'Dados inválidos - Erro de validação',
        },
        409: {
          content: SwaggerContentType.JSON,
          description: 'Email já está em uso',
        },
        500: {
          content: SwaggerContentType.JSON,
          description: 'Erro interno do servidor',
        },
      },
    });

  app.use(route.instance());
}


