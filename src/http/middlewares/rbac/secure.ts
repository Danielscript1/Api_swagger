import { Request, Response, NextFunction } from 'express';
import { rbac } from "./init";

export function can(action: string, resource: string) {
  
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const role = req.user.role;

    const allowed = await rbac.can(role, action, resource);
    if (!allowed) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    return next();
  };
}