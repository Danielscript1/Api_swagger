import jwt from 'jsonwebtoken';

export function createToken(payload: object):string {

  return jwt.sign(payload,  process.env.SECRET_KEY as string, {
    algorithm: 'HS256',
    expiresIn: '1h', 
  });
}