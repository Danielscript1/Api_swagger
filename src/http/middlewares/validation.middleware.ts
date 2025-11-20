import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';


export function validateRequest<T extends object>(
  dtoClass: ClassConstructor<T>,
  property: 'body' | 'query' | 'params' = 'body'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
  
      const dto = plainToInstance(dtoClass, req[property]);

  
      const errors: ValidationError[] = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true, 
        validationError: { target: false },
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints || {};
          return {
            property: error.property,
            value: error.value,
            constraints: Object.values(constraints),
          };
        });

        return res.status(400).json({
          success: false,
          message: 'Erro de validação',
          errors: formattedErrors,
        });
      }

      req[property] = dto as any;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao validar requisição',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  };
}

