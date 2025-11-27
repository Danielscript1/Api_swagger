import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { compare } from 'bcryptjs';
import { UserCredentialsInvalidError } from '../errors/user-credetials-invalid';
import { createToken } from '../../http/middlewares/auth/jwt/create.jwt';

interface CredentialsUseCaseRequest {
  email: string;
  password: string;
}

interface CredentialsUseCaseResponse {
  token: string;
}

export class CredentialsUseCase {
  constructor(private usersRepository: PrismaUserRepository) {}

  async execute({
    email,
    password,
  }: CredentialsUseCaseRequest): Promise<CredentialsUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserCredentialsInvalidError();
    }

    const doesPasswordMatches = await compare(password, user.password);

    if (!doesPasswordMatches) {
      throw new UserCredentialsInvalidError();
    }

    const token = createToken({
      sub: user.id,
      email: user.email,
      role:user.role
    });

    return {
      token,
    };
  }
}