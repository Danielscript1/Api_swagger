import jwt from 'jsonwebtoken';
import { JwtAuthPayload } from '../../../../types/auth';

export function createToken(payload: JwtAuthPayload): string {
  return jwt.sign(payload, process.env.SECRET_KEY as string, {
    algorithm: 'HS256',
    expiresIn: '1h', 
  });
}