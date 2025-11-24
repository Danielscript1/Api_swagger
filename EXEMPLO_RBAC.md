# 📚 Exemplos de Uso do RBAC - Boas Práticas

## 🎯 Estrutura de Middlewares

A ordem dos middlewares é importante! Sempre siga esta ordem:

1. **Validação** (schemaValidator)
2. **Autenticação** (authenticate)
3. **Autorização** (RBAC - can)

## 📝 Exemplos Práticos

### 1. Rota Pública (sem autenticação)

```typescript
// src/http/controller/register.controller.ts
import { schemaValidator } from '../../validation/schemaValidator';
import { register } from '../../use-cases/register/register';

route
  .post('/register', schemaValidator.register, register)
  .swagger({ /* ... */ });
```

### 2. Rota Protegida (requer autenticação + RBAC)

```typescript
// src/http/controller/user.controller.ts
import { authenticate } from '../middlewares/auth/auth.middleware';
import { userPermissions } from '../middlewares/rbac/permissions';
import { schemaValidator } from '../../validation/schemaValidator';
import { createUser } from '../../use-cases/user/create-user';

route
  .post(
    '/users',
    authenticate(),           // 1. Verifica autenticação
    userPermissions.create,  // 2. Verifica permissão RBAC
    schemaValidator.createUser,
    createUser
  )
  .swagger({ /* ... */ });
```

### 3. Múltiplas Permissões (OR)

```typescript
import { userPermissions, adminPermissions } from '../middlewares/rbac/permissions';

// Usuário pode criar OU admin pode criar
route
  .post(
    '/users',
    authenticate(),
    async (req, res, next) => {
      const canCreate = await userPermissions.create(req, res, () => {});
      if (canCreate) return next();
      return adminPermissions.deleteUser(req, res, next);
    },
    createUser
  );
```

### 4. Rota com Role Específica

```typescript
import { authenticate, requireRole } from '../middlewares/auth/auth.middleware';

route
  .delete(
    '/users/:id',
    authenticate(),
    requireRole('admin', 'superadmin'), // Apenas admin ou superadmin
    deleteUser
  );
```

### 5. Exemplo Completo - Controller de Usuários

```typescript
// src/http/controller/user.controller.ts
import type { Express } from 'express';
import { SwaggerRouter, SwaggerContentType } from '../routes/swagger';
import { swagger } from '../routes/swagger';
import { authenticate } from '../middlewares/auth/auth.middleware';
import { userPermissions } from '../middlewares/rbac/permissions';
import { schemaValidator } from '../../validation/schemaValidator';
import { createUser, listUsers, updateUser, deleteUser } from '../../use-cases/user';

export function userController(app: Express) {
  const userTag = {
    name: 'Users',
    description: 'Gerenciamento de usuários'
  };

  const route = new SwaggerRouter(swagger, '/api/users', userTag);

  // Listar usuários - requer autenticação e permissão de visualização
  route
    .get(
      '/',
      authenticate(),
      userPermissions.view,
      listUsers
    )
    .swagger({
      summary: 'Listar usuários',
      security: [{ bearerAuth: [] }],
      responses: { /* ... */ }
    });

  // Criar usuário - requer autenticação e permissão de criação
  route
    .post(
      '/',
      authenticate(),
      userPermissions.create,
      schemaValidator.createUser,
      createUser
    )
    .swagger({
      summary: 'Criar usuário',
      security: [{ bearerAuth: [] }],
      responses: { /* ... */ }
    });

  // Atualizar usuário - requer autenticação e permissão de atualização
  route
    .put(
      '/:id',
      authenticate(),
      userPermissions.update,
      schemaValidator.updateUser,
      updateUser
    )
    .swagger({
      summary: 'Atualizar usuário',
      security: [{ bearerAuth: [] }],
      responses: { /* ... */ }
    });

  // Deletar usuário - requer autenticação e permissão de deleção
  route
    .delete(
      '/:id',
      authenticate(),
      userPermissions.delete,
      deleteUser
    )
    .swagger({
      summary: 'Deletar usuário',
      security: [{ bearerAuth: [] }],
      responses: { /* ... */ }
    });

  app.use(route.instance());
}
```

## 🔐 Configuração RBAC

### Arquivo de Permissões Centralizado

```typescript
// src/http/middlewares/rbac/permissions.ts
import { can } from './secure';

export const userPermissions = {
  create: can('create', 'user'),
  view: can('view', 'user'),
  update: can('update', 'user'),
  delete: can('delete', 'user'),
};

export const passwordPermissions = {
  change: can('change', 'password'),
  forgot: can('forgot', 'password'),
};
```

## ⚠️ Boas Práticas

1. **Sempre use `authenticate()` antes de RBAC** - RBAC precisa de `req.user`
2. **Centralize as permissões** - Use arquivo `permissions.ts` para reutilização
3. **Documente no Swagger** - Adicione `security: [{ bearerAuth: [] }]` nas rotas protegidas
4. **Ordem dos middlewares** - Validação → Autenticação → Autorização → Handler
5. **Tratamento de erros** - Os middlewares já retornam erros apropriados (401, 403)

## 🚀 Inicialização

Não esqueça de inicializar o RBAC no início da aplicação:

```typescript
// src/server.ts ou src/routes/routes.ts
import { initRBAC } from './http/middlewares/rbac/init';

async function setup() {
  await initRBAC(); // Inicializa o RBAC
  // ... resto da configuração
}
```

