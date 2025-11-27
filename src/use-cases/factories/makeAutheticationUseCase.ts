import { PrismaUserRepository } from "../../repositories/prisma-users-repository";

export function makeAutheticationUseCase(){
     const usersRepository = new PrismaUserRepository()
     return usersRepository
}