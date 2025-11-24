import { app } from './app';
import { initRBAC } from './http/middlewares/rbac/init';
import { privateRoutes } from './http/routes/routes'


const port = process.env.PORT || 3000;

privateRoutes(app);

async function setup(){
  try{
    await initRBAC();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
    });
  }catch(err){
   console.error('Erro ao inicializar RBAC:', err);
  }
}

setup()