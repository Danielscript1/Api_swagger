import { validateRequest } from '../http/middlewares/validation.middleware';
import { LoginDTO } from '../use-cases/credentials/credentials.dto';


export const schemaValidator = {
  login: validateRequest(LoginDTO, 'body'),
};
