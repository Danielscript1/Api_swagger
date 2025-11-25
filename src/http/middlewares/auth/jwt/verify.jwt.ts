import jwt from 'jsonwebtoken';

export async function verifyToken(token: string | undefined) {
  try {
    const decoded = jwt.verify(token as string, process.env.SECRET_KEY as string);
    return decoded; 
  } catch (err) {
    return null; 
}
}