import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { CredentialsUseCase } from "../credentials/credentials";

export function makeCredentialsUseCase() {
  const usersRepository = new PrismaUserRepository();
  const credentialsUseCase = new CredentialsUseCase(usersRepository);

  return credentialsUseCase;
}

