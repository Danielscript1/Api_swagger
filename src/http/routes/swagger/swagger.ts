import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { RouteConfig, SwaggerConfig, SwaggerDoc, SwaggerOptions, SwaggerRouteDoc, SwaggerTag } from './types';
import { ApplicationSwagger } from './types';
import fs from 'fs';

type SwaggerRouteAdapter = {
  [path: string]: SwaggerRouteDoc[];
};

export const schema = validationMetadatasToSchemas({});

const parseParamToSwaggerParam = (path: string) => {
  const route = path.split('/');
  route.forEach((x) => {
    if (x.includes(':')) {
      const newRoute = x.replace(':', '{') + '}';
      path = path.replace(x, newRoute);
    }
  });
  return path;
};

export class Swagger {
  public schemas: string[] = [];
  public swagger: SwaggerDoc;
  public dto: any = {};
  public routeData: SwaggerRouteDoc[] = [];

  public logger = console.info;

  constructor(config: SwaggerConfig, options?: SwaggerOptions) {
    this.swagger = {
      openapi: '3.0.0',
      info: config.info,
      servers: config.servers,
      paths: {},
      tags: [],
      components: {
        securitySchemes: {
          bearerAuth: {
            description: 'Bearer Authentication (AccessToken)',
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    };

    this.configOptions(options);
  }

  public configOptions(options?: SwaggerOptions) {
    if (options?.logger) {
      this.logger = options.logger;
    }
  }

  public syncSchema() {
    this.dto = validationMetadatasToSchemas({});
    this.swagger.components.schemas = this.dto;
  }

  private generate(adapter: SwaggerRouteAdapter) {
    let swagger: any = {};

    Object.keys(adapter).map((path) => {
      for (let routeData of adapter[path]) {
        const { config, route, tag } = routeData;

        path = parseParamToSwaggerParam(`${path}`);

        let tagName = tag?.name;

        const methodData = route;
        const content: any = {};
        let responses: Record<string, any> = {
          '200': {},
          '401': {},
          '500': {},
        };
        if (methodData.responses) {
          responses = methodData.responses;
          Object.keys(methodData.responses)
            ?.map(Number)
            .forEach((key) => {
              if (methodData.responses?.[key]?.content) {
                responses[key].content = {
                  [methodData.responses?.[key]?.content!]: {
                    schema: methodData.responses?.[key]?.name ? this.dto[methodData.responses?.[key]?.name!] : undefined,
                  },
                };
              }
            });
        }

        if (methodData.schema?.content) {
          const getSchema = (methodData?: ApplicationSwagger) => {
            if (methodData?.schema?.name) {
              return this.dto[methodData?.schema.name];
            }
            if (methodData?.schema?.config) {
              return methodData?.schema?.config;
            }
            return undefined;
          };

          content[methodData?.schema?.content] = {
            schema: getSchema(methodData),
          };
        }
        this.logger(`Swagger Route: ${config.method.toUpperCase()} ${path}`);
        if (tag) {
          this.swagger.tags.push(tag);
        }

        swagger[path] = swagger[path] || {};
        swagger[path][config.method.toLowerCase()] = {
          tags: [tagName],
          ...methodData,

          requestBody: {
            content,
          },
          responses,
        };
      }
    });

    return swagger;
  }

  addRoute(config: RouteConfig, route: ApplicationSwagger, tag?: SwaggerTag) {
    this.routeData.push({ config, route, tag });
  }

  groupByPath(routeData: SwaggerRouteDoc[]) {
    const grouped: any = {};
    for (let route of routeData) {
      if (grouped[route.config.path]) grouped[route.config.path].push(route);
      else grouped[route.config.path] = [route];
    }

    return grouped;
  }

  doc() {
    this.syncSchema();
    const grouped = this.groupByPath(this.routeData);
    this.swagger.paths = {
      ...this.swagger.paths,
      ...this.generate(grouped),
    };
  }

  saveJsonToFileSync(data: any, filePath: string) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.info('JSON salvo com sucesso em:', filePath);
    } catch (error) {
      console.error('Erro ao salvar JSON:', error);
    }
  }
}

