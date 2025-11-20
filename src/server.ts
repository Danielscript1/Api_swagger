import dotenv from 'dotenv';
import { app } from './app';
import { privateRoutes } from './http/routes/routes'

dotenv.config();

const port = process.env.PORT || 3000;

privateRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
});