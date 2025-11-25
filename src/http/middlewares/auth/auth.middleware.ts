import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt/verify.jwt';
import { AuthUser } from '../../../types/auth';

export function authenticate() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Não autenticado',
          message: 'Token de autenticação necessário' 
        });
      }

      const token = authHeader.substring(7); 
      const decoded = await verifyToken(token);

      if (!decoded || typeof decoded === 'string') {
        return res.status(401).json({ 
          error: 'Token inválido',
          message: 'Token de autenticação inválido ou expirado' 
        });
      }

      req.user = decoded as AuthUser;

      next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: error instanceof Error ? error.message : 'Erro de autenticação' 
      });
    }
  };
}




