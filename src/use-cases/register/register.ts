import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { hash } from 'bcryptjs';
import { publishEmployeeCreated } from '../../messaging/producers/register-producer';
import { UserAlreadyExistsError } from '../errors/users-alredy-exisits-error';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  document?: string;
  phone?: string;
}

interface RegisterUseCaseResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class RegisterUseCase {
  constructor(private usersRepository: PrismaUserRepository) {}

  async execute({
    name,
    email,
    password,
    document,
    phone,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const newUser = await this.usersRepository.createUser({
      name,
      password: password_hash,
      email,
      document,
      phone,
    });

    await publishEmployeeCreated(newUser);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  }
} 