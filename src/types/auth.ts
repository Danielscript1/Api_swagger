export interface AuthUser {
  id: string;
  role: string;
  email?: string;
  name?: string;
  [key: string]: any; 
}

/**
 * Payload do JWT que estende JwtPayload com as propriedades do AuthUser
 */
export interface JwtAuthPayload {
  id: string;
  role: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}



