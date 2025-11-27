import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { RegisterUseCase } from "../register/register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}

