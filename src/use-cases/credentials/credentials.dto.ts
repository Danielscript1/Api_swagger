import 'reflect-metadata';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class LoginDTO {
  @IsEmail()
  @JSONSchema({ 
    description: 'Email do usuário para autenticação', 
    example: 'usuario@exemplo.com' 
  })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @JSONSchema({ 
    description: 'Senha do usuário', 
    example: 'senha123' 
  })
  password!: string;
}

