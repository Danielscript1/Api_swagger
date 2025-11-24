import { Swagger } from "./swagger";


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
    { url: `http://localhost:${process.env.PORT}` }, 
  ],
});

export { Swagger } from "./swagger";
export { SwaggerRouter } from "./SwaggerRouter";
export { SwaggerPage } from "./SwaggerPage";
export * from "./swagger.factory";
export * from "./types";
export { SwaggerContentType } from "./types";



