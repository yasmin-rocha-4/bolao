import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApostaSchema, updateApostaSchema } from "./aposta.schema.js";

export function registerApostaPaths(registry: OpenAPIRegistry) {
  const idParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  registry.registerPath({
    method: "post",
    path: "/apostas",
    tags: ["Apostas"],
    summary: "Criar aposta",
    request: {
      body: {
        content: {
          "application/json": {
            schema: createApostaSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Aposta criada",
      },
      400: {
        description: "Dados inválidos ou campanha fora do período",
      },
      403: {
        description: "Campanha privada",
      },
      404: {
        description: "Opção da campanha não encontrada",
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/apostas/{id}",
    tags: ["Apostas"],
    summary: "Atualizar aposta",
    request: {
      params: idParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateApostaSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Aposta atualizada",
      },
      404: {
        description: "Aposta não encontrada",
      },
    },
  });
}
