# Middlewares de Validação

## 📋 Como Usar

### 1. Criar um DTO (Data Transfer Object)

Primeiro, crie um DTO com decorators do `class-validator`:

```typescript
// src/use-cases/meu-dto.dto.ts
import 'reflect-metadata';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class CriarUsuarioDTO {
  @IsString()
  @MinLength(3)
  @JSONSchema({ description: 'Nome do usuário', example: 'João Silva' })
  nome!: string;

  @IsEmail()
  @JSONSchema({ description: 'Email do usuário', example: 'joao@exemplo.com' })
  email!: string;
}
```

### 2. Criar um Validator

Crie um arquivo de validator que exporta os middlewares:

```typescript
// src/use-cases/meu-validator.ts
import { validateRequest } from '../http/middlewares/validation.middleware';
import { CriarUsuarioDTO } from './meu-dto.dto';

export const meuValidator = {
  criarUsuario: validateRequest(CriarUsuarioDTO, 'body'),
  // Você pode validar query params também:
  // buscarPorId: validateRequest(BuscarPorIdDTO, 'params'),
  // filtrar: validateRequest(FiltrarDTO, 'query'),
};
```

### 3. Usar na Rota

Use o middleware antes do handler:

```typescript
import { meuValidator } from '../../use-cases/meu-validator';
import { criarUsuario } from '../../use-cases/criar-usuario';

route
  .post('/usuarios', meuValidator.criarUsuario, criarUsuario)
  .swagger({
    summary: 'Criar usuário',
    schema: {
      name: 'CriarUsuarioDTO',
      content: SwaggerContentType.JSON,
    },
    // ...
  });
```

### 4. Usar no Handler

No handler, o `req.body` já está validado e tipado:

```typescript
import { Request, Response } from 'express';
import { CriarUsuarioDTO } from './meu-dto.dto';

export async function criarUsuario(req: Request, res: Response) {
  // req.body já está validado e tipado como CriarUsuarioDTO
  const dados: CriarUsuarioDTO = req.body;
  
  // TypeScript sabe que dados.nome e dados.email existem
  // E que os dados já foram validados (email válido, nome com mínimo de 3 caracteres)
  
  // Sua lógica aqui...
  
  return res.json({ success: true, data: dados });
}
```

## 🎯 Vantagens

1. **Validação Automática**: Os dados são validados antes de chegar no handler
2. **Type Safety**: TypeScript conhece os tipos dos dados
3. **Erros Padronizados**: Erros de validação retornam formato consistente
4. **Documentação Automática**: O Swagger gera a documentação baseado no DTO
5. **Reutilizável**: Um mesmo DTO pode ser usado em múltiplas rotas
6. **Segurança**: Propriedades não permitidas são removidas automaticamente

## 📝 Exemplo de Resposta de Erro

Quando a validação falha, a resposta será:

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": [
    {
      "property": "email",
      "value": "email-invalido",
      "constraints": [
        "email must be an email"
      ]
    },
    {
      "property": "nome",
      "value": "ab",
      "constraints": [
        "nome must be longer than or equal to 3 characters"
      ]
    }
  ]
}
```

## 🔧 Validação de Query Params

Para validar query parameters:

```typescript
// DTO para query params
export class FiltrarUsuariosDTO {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;
}

// Validator
export const usuariosValidator = {
  filtrar: validateRequest(FiltrarUsuariosDTO, 'query'),
};

// Uso na rota
route
  .get('/usuarios', usuariosValidator.filtrar, listarUsuarios)
```

## 🔧 Validação de Params

Para validar route parameters:

```typescript
// DTO para params
export class BuscarUsuarioDTO {
  @IsUUID()
  id!: string;
}

// Validator
export const usuariosValidator = {
  buscarPorId: validateRequest(BuscarUsuarioDTO, 'params'),
};

// Uso na rota
route
  .get('/usuarios/:id', usuariosValidator.buscarPorId, buscarUsuario)
```

## ⚠️ Importante

- Sempre importe `reflect-metadata` no início do arquivo do DTO
- Use `!` (non-null assertion) nas propriedades obrigatórias do DTO
- O middleware substitui o objeto original pelo DTO validado
- Propriedades não definidas no DTO são removidas automaticamente (whitelist)

