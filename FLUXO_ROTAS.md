# 🔄 Fluxo de Montagem de Rotas

## Passo a Passo:

### 1️⃣ Criar Router Vazio
```typescript
const publicRouter = Router();
// publicRouter = { rotas: [] }  ← Vazio
```

### 2️⃣ Controller Adiciona Rotas ao Router
```typescript
credentialsController(publicRouter)
  ↓
const route = new SwaggerRouter(swagger, '', ...)
route.post('/credentials', handler)
  ↓
route.instance() retorna: Router com POST /credentials
  ↓
app.use(route.instance())  // Adiciona ao publicRouter
```

**Após credentialsController:**
```
publicRouter = {
  rotas: [
    POST /credentials → handler
  ]
}
```

### 3️⃣ Segundo Controller Adiciona Mais Rotas
```typescript
registerController(publicRouter)
  ↓
// Mesmo processo...
```

**Após registerController:**
```
publicRouter = {
  rotas: [
    POST /credentials → handler,
    POST /register    → handler
  ]
}
```

### 4️⃣ Aplicar Prefixo `/api`
```typescript
app.use('/api', publicRouter)
```

**Express faz internamente:**
```
Para cada rota em publicRouter:
  - Pega o path: /credentials
  - Adiciona prefixo: /api
  - Resultado: /api/credentials
```

**Resultado Final no App:**
```
app = {
  rotas: [
    POST /api/credentials → handler,
    POST /api/register    → handler
  ]
}
```

## 🎯 Resumo Visual:

```
Router() vazio
    ↓
credentialsController adiciona: POST /credentials
    ↓
registerController adiciona: POST /register
    ↓
publicRouter tem: [/credentials, /register]
    ↓
app.use('/api', publicRouter)
    ↓
App final tem: [/api/credentials, /api/register]
```

## 🔑 Pontos Importantes:

1. **Router()** = Container de rotas (como uma pasta)
2. **Controllers** = Adicionam rotas ao container (sem prefixo)
3. **app.use('/api', router)** = Aplica prefixo a TODAS as rotas do router
4. O prefixo é aplicado DEPOIS que todas as rotas já foram adicionadas

