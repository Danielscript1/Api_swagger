# 📖 Como Usar o Swagger - Guia Completo

## ✅ O que foi implementado

Foi criada uma implementação completa do Swagger no backend, baseada na estrutura do projeto exemplo. A implementação está localizada em `src/http/routes/swagger/`.

## 🚀 Como Acessar

Após iniciar o servidor com `npm run dev`, acesse:

1. **Página Inicial da Documentação**: 
   - URL: `http://localhost:3000/api-docs`
   - Mostra uma página bonita com links para a documentação

2. **Documentação Swagger Interativa**:
   - URL: `http://localhost:3000/api-docs/swagger`
   - Interface completa do Swagger UI onde você pode testar os endpoints

3. **JSON do Swagger**:
   - URL: `http://localhost:3000/api-docs/swagger/swagger.json`
   - Arquivo JSON com toda a especificação OpenAPI

## 📝 Como Documentar uma Nova Rota

### Exemplo Básico (GET)

```typescript
import { SwaggerRouter } from './routes/swagger';
import { swagger, SwaggerContentType } from './routes/swagger';

// 1. Criar uma tag para agrupar rotas
const minhaTag = {
    name: 'Minha API',
    description: 'Descrição do grupo de rotas'
};

// 2. Criar o router
const meuRouter = new SwaggerRouter(swagger, '/api', minhaTag);

// 3. Definir a rota com documentação
meuRouter
    .get('/usuarios', meuHandler)
    .swagger({
        summary: 'Listar usuários',
        description: 'Retorna uma lista de todos os usuários',
        responses: {
            200: {
                content: SwaggerContentType.JSON,
                description: 'Lista retornada com sucesso'
            }
        }
    });

// 4. Registrar no app
app.use(meuRouter.instance());
```

### Exemplo com Parâmetros (GET com ID)

```typescript
import { SwaggerParamID } from './routes/swagger/swagger.factory';

meuRouter
    .get('/usuarios/:id', buscarUsuario)
    .swagger({
        summary: 'Buscar usuário por ID',
        parameters: [
            SwaggerParamID // Parâmetro padrão para ID
        ],
        responses: {
            200: { content: SwaggerContentType.JSON },
            404: { content: SwaggerContentType.JSON }
        }
    });
```

### Exemplo POST com Body

```typescript
// Primeiro, crie uma classe DTO
import { IsString, IsEmail } from 'class-validator';

class CriarUsuarioDTO {
    @IsString()
    nome: string;

    @IsEmail()
    email: string;
}

// Depois use na rota
meuRouter
    .post('/usuarios', criarUsuario)
    .swagger({
        summary: 'Criar usuário',
        schema: {
            name: 'CriarUsuarioDTO', // Nome da classe
            content: SwaggerContentType.JSON
        },
        responses: {
            201: { content: SwaggerContentType.JSON },
            400: { content: SwaggerContentType.JSON }
        }
    });
```

### Exemplo com Query Parameters

```typescript
import { SwaggerParam } from './routes/swagger/swagger.factory';

meuRouter
    .get('/usuarios', listarUsuarios)
    .swagger({
        summary: 'Listar usuários com filtros',
        parameters: [
            SwaggerParam('query', 'nome', 'Filtrar por nome', 'string', false),
            SwaggerParam('query', 'page', 'Número da página', 'integer', false, 1),
            SwaggerParam('query', 'size', 'Itens por página', 'integer', false, 20)
        ],
        responses: {
            200: { content: SwaggerContentType.JSON }
        }
    });
```

## 🛠️ Helpers Disponíveis

### SwaggerParam
Cria um parâmetro customizado:
```typescript
SwaggerParam(
    'path' | 'query' | 'formData',  // Onde o parâmetro está
    'nome',                          // Nome do parâmetro
    'Descrição',                     // Descrição
    'string' | 'integer' | 'file',   // Tipo
    true,                            // Obrigatório? (opcional)
    'exemplo'                        // Exemplo (opcional)
)
```

### SwaggerParamID
Parâmetro padrão para ID em path:
```typescript
SwaggerParamID  // Equivale a SwaggerParam('path', 'id', 'Model Id', 'string')
```

### SwaggerListDefault
Cria parâmetros padrão para listagem paginada:
```typescript
SwaggerListDefault(
    'filtro exemplo',
    'busca exemplo', 
    'where exemplo',
    'order exemplo'
)
```

## 📦 Estrutura de Arquivos

```
src/http/routes/swagger/
├── index.ts              # Configuração principal e exports
├── swagger.ts            # Classe principal do Swagger
├── SwaggerRouter.ts      # Router customizado com suporte a Swagger
├── SwaggerPage.ts        # Geração da página de documentação
├── swaggerIndexPage.ts   # HTML da página inicial
├── swagger.factory.ts    # Helpers e funções utilitárias
├── types.ts              # Tipos TypeScript
└── README.md             # Documentação detalhada
```

## ⚙️ Configuração

A configuração do Swagger está em `src/http/routes/swagger/index.ts`. Você pode personalizar:

- Título da API
- Versão
- Descrição
- URLs dos servidores
- Informações de contato

## 🔐 Autenticação

O Swagger já está configurado com dois esquemas de autenticação:

1. **Bearer Auth**: JWT Token
   - Header: `Authorization: Bearer <token>`

2. **ApiKey Auth**: API Key
   - Header: `Identity: <key>`

Para usar em uma rota, adicione no `.swagger()`:
```typescript
.swagger({
    // ... outras opções
    security: [{ bearerAuth: [] }]
})
```

## 💡 Dicas

1. **DTOs com class-validator**: Use decorators do `class-validator` nas suas classes DTO para que o Swagger gere automaticamente os schemas:
   ```typescript
   import { IsString, IsEmail, MinLength } from 'class-validator';
   
   class MeuDTO {
       @IsString()
       @MinLength(3)
       nome: string;
   }
   ```

2. **Tags**: Use tags para agrupar rotas relacionadas. Isso organiza melhor a documentação.

3. **Base Path**: O segundo parâmetro do `SwaggerRouter` é o base path. Use para prefixar todas as rotas de um grupo.

4. **Múltiplas Respostas**: Sempre documente os diferentes códigos de resposta (200, 400, 404, 500, etc.).

## 🎯 Exemplo Completo de Uso

Veja o arquivo `src/http/routes.ts` para um exemplo completo de como está sendo usado atualmente com a rota `/credentials`.

## 📚 Mais Informações

Para mais detalhes, consulte o arquivo `src/http/routes/swagger/README.md`.


