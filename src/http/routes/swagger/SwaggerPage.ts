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
    const swaggerBase = swaggerUi.generateHTML(swagger.swagger);
    express.use(baseRoute, swaggerUi.serveFiles(swagger.swagger));
    express.get(baseRoute, (req, res) => {
      res.send(swaggerBase);
    });
  }

  static addJsonDownloadRoute(express: express.Application, baseRoute: string, swagger: Swagger) {
    express.get(`${baseRoute}/swagger.json`, (req, res) => {
      swagger.doc();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="swagger.json"');
      res.json(swagger.swagger);
    });
  }
}

