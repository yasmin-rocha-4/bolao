import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createCampanhaSchema,
  updateCampanhaSchema,
} from "./campanha.schema.js";

export function registerCampanhaPaths(registry: OpenAPIRegistry) {
  const campanhaResponseSchema = z.object({
    id: z.number(),
    nome: z.string(),
    data_inicio: z.date(),
    data_fim: z.date(),
    tx_operacional: z.number(),
    valor_bolao: z.number(),
    is_publica: z.boolean(),
    codigo_campanha: z.string(),
    status: z.string(),
  });

  const idParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  registry.registerPath({
    method: "post",
    path: "/campanhas",
    tags: ["Campanhas"],
    summary: "Criar campanha",
    request: {
      body: {
        content: {
          "application/json": {
            schema: createCampanhaSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Campanha criada",
        content: {
          "application/json": {
            schema: campanhaResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos",
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/campanhas/{id}",
    tags: ["Campanhas"],
    summary: "Atualizar campanha",
    request: {
      params: idParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateCampanhaSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Campanha atualizada",
      },
      404: {
        description: "Campanha não encontrada",
      },
    },
  });
}
