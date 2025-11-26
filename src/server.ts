import { app } from './app';
import { initRBAC } from './http/middlewares/rbac/init';
import { setupRouter } from './http/routes';
import { initRedis } from './infra/cache/redisClient';



const port = process.env.PORT || 3000;


async function setup(){
  try{
    await initRBAC();
    await setupRouter(app)
    await initRedis()
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
    });
  }catch(err){
   console.error('Erro ao inicializar RBAC:', err);
  }
}

setup()