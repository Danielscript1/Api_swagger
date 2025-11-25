import { Router } from 'express';
import 'reflect-metadata';
import '../../use-cases/credentials/credentials.dto';
import { credentialsController, registerController } from '../controller';


export async function publicRoutes() {

  const publicRouter = Router();
  await credentialsController(publicRouter);
  await registerController(publicRouter)

  return publicRouter;
}

