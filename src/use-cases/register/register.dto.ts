import 'reflect-metadata';
import { IsString, IsEmail, MinLength, IsOptional, maxLength, MaxLength, Matches } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class RegisterDTO {

  @MinLength(1, { message: 'nome usuário' })
  @JSONSchema({ 
    description: 'nome do usuário', 
    example: 'Thor' 
  })
  name: string;

  @IsEmail()
  @MinLength(1, { message: 'Email usuário para autenticação' })
  @JSONSchema({ 
    description: 'Email do usuário para autenticação', 
    example: 'usuario@exemplo.com' 
  })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Senha usuário para autenticação' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      'Senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial',
  })
  @JSONSchema({ 
    description: 'Senha do usuário', 
    example: 'senha123' 
  })
  password!: string;

  @IsString()
  @IsOptional()
  @JSONSchema({ 
    description: 'telefone para contato', 
    example: '86 999999999' 
  })
  phone: string;

  @IsString()
  @IsOptional()
  @MinLength(11, { message: 'cpf deve contem 11 caractere' })
  @MaxLength(11,{ message: 'cpf deve contem 11 caractere' })
  @JSONSchema({ 
    description: 'cpf do usuario', 
    example: '000.000.000-00' 
  })
  document: string;
}

