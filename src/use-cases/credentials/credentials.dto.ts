import 'reflect-metadata';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class LoginDTO {
  @IsEmail()
  @MinLength(1, { message: 'Email usuário para autenticação' })
  @JSONSchema({ 
    description: 'Email do usuário para autenticação', 
    example: 'usuario@exemplo.com' 
  })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Senha usuário para autenticação' })
  @JSONSchema({ 
    description: 'Senha do usuário', 
    example: 'senha123' 
  })
  password!: string;
}

