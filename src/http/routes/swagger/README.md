# Documentação do Swagger

## 📚 Como usar o Swagger no Backend

Este projeto utiliza uma implementação customizada do Swagger para documentar automaticamente as APIs.

## 🚀 Início Rápido

### 1. Acessar a Documentação

Após iniciar o servidor, acesse:
- **Página inicial**: `http://localhost:3000/api-docs`
- **Documentação Swagger**: `http://localhost:3000/api-docs/swagger`
- **JSON do Swagger**: `http://localhost:3000/api-docs/swagger/swagger.json`

### 2. Criar uma Rota com Documentação

```typescript
import { SwaggerRouter } from './routes/swagger';
import { swagger, SwaggerContentType } from './routes/swagger';
import { SwaggerParam } from './routes/swagger/swagger.factory';

// Criar uma tag para agrupar rotas relacionadas
const minhaTag = {
    name: 'Minha API',
    description: 'Descrição do grupo de rotas'
};

// Criar o router com Swagger
const meuRouter = new SwaggerRouter(swagger, '/api', minhaTag);

// Definir uma rota GET
meuRouter
    .get('/usuarios', meuHandler)
    .swagger({
        summary: 'Listar usuários',
        description: 'Retorna uma lista de todos os usuários',
        responses: {
            200: {
                content: SwaggerContentType.JSON,
                description: 'Lista de usuários retornada com sucesso'
            },
            404: {
                content: SwaggerContentType.JSON,
                description: 'Nenhum usuário encontrado'
            }
        }
    });

// Registrar no app
app.use(meuRouter.instance());
```

### 3. Rota com Parâmetros

```typescript
import { SwaggerParam } from './routes/swagger/swagger.factory';

meuRouter
    .get('/usuarios/:id', buscarUsuario)
    .swagger({
        summary: 'Buscar usuário por ID',
        description: 'Retorna os dados de um usuário específico',
        parameters: [
            SwaggerParam('path', 'id', 'ID do usuário', 'string', true, '123')
        ],
        responses: {
            200: {
                content: SwaggerContentType.JSON,
                description: 'Usuário encontrado'
            },
            404: {
                content: SwaggerContentType.JSON,
                description: 'Usuário não encontrado'
            }
        }
    });
```

### 4. Rota POST com Body

```typescript
// Primeiro, crie uma classe DTO com class-validator
import { IsString, IsEmail, MinLength } from 'class-validator';

class CriarUsuarioDTO {
    @IsString()
    @MinLength(3)
    nome: string;

    @IsEmail()
    email: string;
}

// Depois, use na rota
meuRouter
    .post('/usuarios', criarUsuario)
    .swagger({
        summary: 'Criar novo usuário',
        description: 'Cria um novo usuário no sistema',
        schema: {
            name: 'CriarUsuarioDTO', // Nome da classe DTO
            content: SwaggerContentType.JSON
        },
        responses: {
            201: {
                content: SwaggerContentType.JSON,
                description: 'Usuário criado com sucesso'
            },
            400: {
                content: SwaggerContentType.JSON,
                description: 'Dados inválidos'
            }
        }
    });
```

### 5. Rota com Query Parameters

```typescript
import { SwaggerListDefault } from './routes/swagger/swagger.factory';

meuRouter
    .get('/usuarios', listarUsuarios)
    .swagger({
        summary: 'Listar usuários com paginação',
        description: 'Retorna uma lista paginada de usuários',
        parameters: SwaggerListDefault(
            'filtro exemplo',
            'busca exemplo',
            'where exemplo',
            'order exemplo'
        ),
        responses: {
            200: {
                content: SwaggerContentType.JSON,
                description: 'Lista de usuários'
            }
        }
    });
```

## 📝 Helpers Disponíveis

### SwaggerParam
Cria um parâmetro para a documentação:
```typescript
SwaggerParam(
    paramIn: 'path' | 'query' | 'formData',
    name: string,
    description: string,
    type: 'integer' | 'string' | 'file',
    required?: boolean,
    example?: any
)
```

### SwaggerParamID
Parâmetro padrão para ID:
```typescript
SwaggerParamID // path param 'id' do tipo string
```

### SwaggerListDefault
Cria parâmetros padrão para listagem com paginação:
```typescript
SwaggerListDefault(filter, search, where, order)
```

### SwaggerBody
Cria um schema de body customizado:
```typescript
SwaggerBody({
    campo1: { type: 'string', format: 'string' },
    campo2: { type: 'string', format: 'binary' }
})
```

## 🎯 Exemplo Completo

```typescript
import { SwaggerRouter } from './routes/swagger';
import { swagger, SwaggerContentType } from './routes/swagger';
import { SwaggerParam, SwaggerParamID } from './routes/swagger/swagger.factory';

// Tag
const produtosTag = {
    name: 'Produtos',
    description: 'Gerenciamento de produtos'
};

// Router
const produtosRouter = new SwaggerRouter(swagger, '/api/produtos', produtosTag);

// GET /api/produtos
produtosRouter
    .get('/', listarProdutos)
    .swagger({
        summary: 'Listar produtos',
        description: 'Retorna todos os produtos',
        responses: {
            200: { content: SwaggerContentType.JSON }
        }
    });

// GET /api/produtos/:id
produtosRouter
    .get('/:id', buscarProduto)
    .swagger({
        summary: 'Buscar produto',
        parameters: [SwaggerParamID],
        responses: {
            200: { content: SwaggerContentType.JSON },
            404: { content: SwaggerContentType.JSON }
        }
    });

// POST /api/produtos
produtosRouter
    .post('/', criarProduto)
    .swagger({
        summary: 'Criar produto',
        schema: {
            name: 'CriarProdutoDTO',
            content: SwaggerContentType.JSON
        },
        responses: {
            201: { content: SwaggerContentType.JSON },
            400: { content: SwaggerContentType.JSON }
        }
    });

// Registrar
app.use(produtosRouter.instance());
```

## ⚙️ Configuração

A configuração do Swagger está em `src/http/routes/swagger/index.ts`:

```typescript
export const swagger = new Swagger({
  info: {
    title: "Backend API",
    version: "1.0.0",
    description: "Documentação da API do Backend",
    contact: {
      name: "Equipe de Desenvolvimento",
    },
  },
  servers: [
    { url: "http://localhost:3000" },
  ],
});
```

## 🔐 Autenticação

O Swagger já está configurado com dois esquemas de autenticação:
- **Bearer Auth**: JWT Token (header: `Authorization: Bearer <token>`)
- **ApiKey Auth**: API Key (header: `Identity: <key>`)

Para usar em uma rota, adicione no swagger:
```typescript
.swagger({
    // ... outras configurações
    security: [{ bearerAuth: [] }] // ou [{ ApiKeyAuth: [] }]
})
```

## 📦 DTOs com class-validator

Para que os DTOs apareçam automaticamente no Swagger, use decorators do `class-validator`:

```typescript
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CriarUsuarioDTO {
    @IsString()
    @MinLength(3)
    nome: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    telefone?: string;
}
```

O Swagger irá gerar automaticamente o schema baseado nos decorators!

## 🎨 Personalização

Você pode personalizar a página inicial do Swagger editando `swaggerIndexPage.ts` e a configuração em `swagger/index.ts`.

