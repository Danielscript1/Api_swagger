import { Swagger } from "./swagger";
import { Doc, docIndex } from "./swaggerIndexPage";
import express from "express";
import swaggerUi from "swagger-ui-express";

export type GenerateParam = {
  doc: Doc;
  swagger: Swagger;
};

export class SwaggerPage {
  static generate(express: express.Application, baseRoute: string, params: GenerateParam[]) {
    const doc = params.map((p) => p.doc);
    express.get(baseRoute, (req, res) => res.send(docIndex(doc)));
    params.forEach((p) => {
      SwaggerPage.api(express, p.doc.link, p.swagger);
      SwaggerPage.addJsonDownloadRoute(express, p.doc.link, p.swagger);
    });
  }

  static api(express: express.Application, baseRoute: string, swagger: Swagger) {
    swagger.doc();
    
    const getSwaggerDoc = (req: express.Request) => {
      const protocol = req.protocol;
      const host = req.get('host');
      const swaggerDoc = JSON.parse(JSON.stringify(swagger.swagger)); // Deep copy
      
      if (!swaggerDoc.servers || swaggerDoc.servers.length === 0) {
        swaggerDoc.servers = [{ url: `${protocol}://${host}` }];
      } else {
        swaggerDoc.servers[0].url = `${protocol}://${host}`;
      }
      
      return swaggerDoc;
    };

    const swaggerOptions: swaggerUi.SwaggerUiOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        tryItOutEnabled: true,
      },
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Documentation',
    };

    express.use(baseRoute, (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const swaggerDoc = getSwaggerDoc(req);
      const serveFiles = swaggerUi.serveFiles(swaggerDoc, swaggerOptions);
      if (Array.isArray(serveFiles)) {
        let index = 0;
        const runNext = () => {
          if (index < serveFiles.length) {
            const middleware = serveFiles[index++];
            if (middleware) {
              middleware(req, res, runNext);
            } else {
              runNext();
            }
          } else {
            next();
          }
        };
        runNext();
      } else {
        next();
      }
    });
    
    express.get(baseRoute, (req: express.Request, res: express.Response) => {
      const swaggerDoc = getSwaggerDoc(req);
      const protocol = req.protocol;
      const host = req.get('host');
      const serverUrl = `${protocol}://${host}`;
      
      if (!swaggerDoc.servers || swaggerDoc.servers.length === 0) {
        swaggerDoc.servers = [{ url: serverUrl }];
      } else {
        swaggerDoc.servers[0].url = serverUrl;
      }

      console.log('Swagger Server URL atualizada para:', swaggerDoc.servers[0].url);
      
      const html = swaggerUi.generateHTML(swaggerDoc, swaggerOptions);
      res.send(html);
    });
  }

  static addJsonDownloadRoute(express: express.Application, baseRoute: string, swagger: Swagger) {
    express.options(`${baseRoute}/swagger.json`, (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Identity, Accept, X-Requested-With');
      res.setHeader('Access-Control-Max-Age', '86400');
      res.status(204).send();
    });

    express.get(`${baseRoute}/swagger.json`, (req, res) => {
      swagger.doc();
      
      const protocol = req.protocol;
      const host = req.get('host');
      const swaggerDoc = { ...swagger.swagger };
      
      if (swaggerDoc.servers && swaggerDoc.servers.length > 0) {
        swaggerDoc.servers[0].url = `${protocol}://${host}`;
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Identity, Accept, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      res.json(swaggerDoc);
    });
  }
}


