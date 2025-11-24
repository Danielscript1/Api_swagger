import { validateRequest } from '../http/middlewares/validation/validation.middleware';
import { LoginDTO } from '../use-cases/credentials/credentials.dto';
import { RegisterDTO } from '../use-cases/register/register.dto';


export const schemaValidator = {
  login: validateRequest(LoginDTO, 'body'),
  register: validateRequest(RegisterDTO, 'body'),
};
