# 📝 Exemplo de Uso do JWT

## ✅ O que foi corrigido:

1. **Interface `JwtAuthPayload`**: Define a estrutura esperada do payload do JWT
2. **Type Guard `isAuthUser`**: Valida se o payload decodificado tem as propriedades necessárias
3. **Função `toAuthUser`**: Converte o payload do JWT para `AuthUser` de forma segura
4. **Função `createToken`**: Agora aceita `JwtAuthPayload` com type safety

## 🚀 Como usar:

### 1. Criar um token (no login/credentials):

```typescript
import { createToken } from '../middlewares/auth/jwt/create.jwt';
import { JwtAuthPayload } from '../../types/auth';

// Exemplo no use-case de credentials
export async function credentials(req: Request, res: Response) {
  // ... validação de email e senha ...
  
  // Buscar usuário no banco
  const user = await userRepository.findByEmail(email);
  
  // Criar payload do JWT
  const payload: JwtAuthPayload = {
    id: user.id,
    role: user.role?.name || 'user', // ou user.roleId
    email: user.email,
    name: user.name,
  };
  
  // Criar token
  const token = createToken(payload);
  
  return res.json({
    success: true,
    message: "Autenticação realizada com sucesso",
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }
  });
}
```

### 2. O middleware `authenticate()` já faz tudo automaticamente:

```typescript
// Em qualquer rota protegida
route
  .get('/profile', authenticate(), getProfile)
  .swagger({ ... });
```

O middleware:
1. ✅ Valida o token
2. ✅ Verifica se tem `id` e `role`
3. ✅ Converte para `AuthUser`
4. ✅ Adiciona em `req.user`

### 3. Usar `req.user` nas rotas:

```typescript
export async function getProfile(req: Request, res: Response) {
  // req.user já está tipado como AuthUser | undefined
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  // TypeScript sabe que req.user tem id, role, email, name
  const userId = req.user.id;
  const userRole = req.user.role;
  
  // ...
}
```

## 🔑 Pontos Importantes:

1. **Não precisa criar payload default** - Apenas garanta que ao criar o token, você passe `id` e `role`
2. **O type guard valida automaticamente** - Se o token não tiver `id` ou `role`, retorna erro 401
3. **Type safety completo** - TypeScript garante que `req.user` tem as propriedades corretas

## ⚠️ Estrutura Mínima do Payload:

```typescript
{
  id: string,      // OBRIGATÓRIO
  role: string,    // OBRIGATÓRIO
  email?: string,  // Opcional
  name?: string    // Opcional
}
```

