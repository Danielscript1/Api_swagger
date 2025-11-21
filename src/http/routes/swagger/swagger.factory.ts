export const SwaggerParam = (
  paramIn: "path" | `query` | "formData",
  name: string,
  description: string,
  type: "integer" | `string` | `file`,
  required = true,
  example?: any
) => {
  return {
    in: paramIn,
    name: name,
    required,
    schema: { type: type, example },
    description: description,
  };
};

export type SwaggerProperties = {
  [key: string]: {
    type: "string";
    format: "binary" | "string";
  };
};

export const SwaggerBody = (properties: SwaggerProperties) => {
  return {
    type: "object",
    properties,
  };
};

export const SwaggerParamID = SwaggerParam(`path`, "id", "Model Id", "string");
export const SwaggerParamIDExample = (id: string) => SwaggerParam(`path`, "id", "Model Id", "string", true, id);
export const SwaggerExportTypeParamID = SwaggerParam(`path`, "type", "csv or xlsx", "string");

export const ImageFile = SwaggerParam(`formData`, "image", "Image file", "file");

export const SwaggerListDefault = (filter: string, search: string, where: string, order: string) => {
  return [
    SwaggerParam(`query`, "page", "Página para a paginação", "integer", false, 1),
    SwaggerParam(`query`, "size", "Quantidade de itens da paginação", "integer", false, 20),
    SwaggerParam(`query`, "f", "Filtros para serem utilizados nas consultas", "string", false, filter),
    SwaggerParam(`query`, "s", "Query utilizada para a busca", "string", false, search),
    SwaggerParam(`query`, "w", "Where que será aplicado nas buscas", "string", false, where),
    SwaggerParam(`query`, "orderBy", "Atributo que será considerado na ordenação", "string", false, order),
    SwaggerParam(`query`, "orderDirection", "Direção da ordenação. asc | desc", "string", false, "asc"),
  ];
};


