import { NextFunction, Request, Response, Router } from "express";

export enum SwaggerContentType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
}

export type ApplicationParam = {
  name: string;
  required: boolean;
  in: "query" | "path" | "formData";
  description?: string;
  schema: {
    type?: "string" | "integer" | `file`;
    default?: any;
    example?: any;
  };
};

export type SwaggerRouterType = Router & {
  swagger(info: ApplicationSwagger): SwaggerRouterType;
};

export type ApplicationRoutePath = {
  middlewares: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>)[];
  swagger?: ApplicationSwagger;
};

export type SwaggerDoc = {
  openapi: string;
  info: SwaggerInfo;
  servers: SwaggerServer[];
  tags: SwaggerTag[];
  paths: any;
  components: any;
};

export type SwaggerConfig = {
  info: SwaggerInfo;
  servers: SwaggerServer[];
};

export type SwaggerTag = {
  name: string;
  description: string;
};

export type SwaggerServer = {
  url: string;
};

export type SwaggerInfo = {
  title: string;
  version: string;
  description: string;
  contact: {
    name: string;
  };
};

type SwaggerSchema = {
  content?: SwaggerContentType;
  name?: string;
  description?: string;
};

export type TMethod = "GET" | `POST` | `PATCH` | `PUT` | `DELETE`;

export type RouteConfig = {
  path: string;
  method: TMethod;
};

export type ApplicationSwagger = {
  description?: string;
  summary?: string;
  schema?: {
    name: string;
    content?: SwaggerContentType;
    config?: any;
  };
  parameters?: ApplicationParam[];
  responses?: Record<number, SwaggerSchema>;
};

export type SwaggerRouteDoc = {
  config: RouteConfig;
  route: ApplicationSwagger;
  tag?: SwaggerTag;
};

export type SwaggerOptions = {
  logger?: any;
  securitySchemes?: any;
};

export type GenClassValidatorFunction = () => any;

export type ValidateFunction = (
  value: any,
  req?: Request,
  res?: Response,
  next?: NextFunction
) => Promise<any>;


