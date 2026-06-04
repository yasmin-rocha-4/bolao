import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createCampanhaOpcoesSchema,
  updateCampanhaOpcoesSchema,
} from "./campanha.opcoes.schema.js";

export function registerCampanhaOpcoesPaths(registry: OpenAPIRegistry) {
  const idParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  registry.registerPath({
    method: "post",
    path: "/campanha-opcoes",
    tags: ["Opções de Campanha"],
    summary: "Criar opção de campanha",
    request: {
      body: {
        content: {
          "application/json": {
            schema: createCampanhaOpcoesSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Opção criada",
      },
      400: {
        description: "Dados inválidos",
      },
      409: {
        description: "Opção duplicada",
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/campanha-opcoes/{id}",
    tags: ["Opções de Campanha"],
    summary: "Atualizar opção de campanha",
    request: {
      params: idParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateCampanhaOpcoesSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Opção atualizada",
      },
      404: {
        description: "Opção não encontrada",
      },
    },
  });
}
