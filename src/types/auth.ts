export interface AuthUser {
  id: string;
  role: string;
  email?: string;
  name?: string;
  [key: string]: any; 
}

