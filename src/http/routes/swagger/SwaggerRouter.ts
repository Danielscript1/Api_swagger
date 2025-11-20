import { Router, RequestHandler } from "express";
import { Swagger } from "./swagger";
import {
  ApplicationSwagger,
  SwaggerRouterType,
  SwaggerTag,
  TMethod,
} from "./types";

export class SwaggerRouter {
  private _path: string = '';
  private _method: TMethod = 'GET';
  private router = Router();
  private swaggerInstances: Swagger[];

  constructor(
    swagger: Swagger[] | Swagger,
    public _basePath: string = "",
    public tag?: SwaggerTag
  ) {
    this.swaggerInstances = !Array.isArray(swagger) ? [swagger] : swagger;

    // Adicionar método swagger ao router
    Object.assign(this.router, {
      swagger: (info: ApplicationSwagger) => {
        this.swaggerInstances.forEach((sw) => {
          sw.addRoute(
            {
              method: this._method,
              path: `${this._basePath}${this._path}`,
            },
            info,
            this.tag
          );
        });
        return this.instance();
      },
    });
  }

  instance() {
    return this.router as SwaggerRouterType;
  }

  // Expor métodos para facilitar o uso
  get(path: string, ...handlers: RequestHandler[]) {
    this._path = path;
    this._method = "GET";
    this.router.get(`${this._basePath}${path}`, ...handlers);
    return this;
  }

  post(path: string, ...handlers: RequestHandler[]) {
    this._path = path;
    this._method = "POST";
    this.router.post(`${this._basePath}${path}`, ...handlers);
    return this;
  }

  patch(path: string, ...handlers: RequestHandler[]) {
    this._path = path;
    this._method = "PATCH";
    this.router.patch(`${this._basePath}${path}`, ...handlers);
    return this;
  }

  put(path: string, ...handlers: RequestHandler[]) {
    this._path = path;
    this._method = "PUT";
    this.router.put(`${this._basePath}${path}`, ...handlers);
    return this;
  }

  delete(path: string, ...handlers: RequestHandler[]) {
    this._path = path;
    this._method = "DELETE";
    this.router.delete(`${this._basePath}${path}`, ...handlers);
    return this;
  }

  swagger(info: ApplicationSwagger) {
    this.swaggerInstances.forEach((sw) => {
      sw.addRoute(
        {
          method: this._method,
          path: `${this._basePath}${this._path}`,
        },
        info,
        this.tag
      );
    });
    return this;
  }
}

