import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createCampanhaSchema,
  updateCampanhaSchema,
} from "./campanha.schema.js";

const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const validationErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(
    z.object({
      campo: z.string(),
      mensagem: z.string(),
    }),
  ),
});

const campanhaSchema = z.object({
  id: z.number(),
  nome: z.string(),
  data_inicio: z.string(),
  data_fim: z.string(),
  tx_operacional: z.number(),
  valor_bolao: z.number(),
  is_publica: z.boolean(),
  codigo_campanha: z.string(),
  status: z.string(),
  criador_id: z.number(),
});

const campanhaResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: campanhaSchema,
});

const campanhasResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(campanhaSchema),
});

const deleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function registerCampanhaPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/campanhas",
    tags: ["Campanhas"],
    summary: "Listar campanhas",
    description:
      "Rota protegida. Administradores visualizam suas campanhas e usuários comuns visualizam campanhas públicas.",
    request: {},
    responses: {
      200: {
        description: "Campanhas encontradas com sucesso",
        content: {
          "application/json": {
            schema: campanhasResponseSchema,
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/campanhas/{id}",
    tags: ["Campanhas"],
    summary: "Buscar campanha por ID",
    description:
      "Rota protegida. Administradores só acessam campanhas próprias; usuários comuns só acessam campanhas públicas disponíveis.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Campanha encontrada com sucesso",
        content: {
          "application/json": {
            schema: campanhaResponseSchema,
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão para acessar esta campanha",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Campanha não encontrada",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/campanhas",
    tags: ["Campanhas"],
    summary: "Criar campanha",
    description:
      "Rota protegida. Apenas administradores podem criar campanhas.",
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
        description: "Campanha criada com sucesso",
        content: {
          "application/json": {
            schema: campanhaResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos ou regra de negócio não atendida",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema.or(errorResponseSchema),
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Apenas administradores podem realizar esta operação",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/campanhas/{id}",
    tags: ["Campanhas"],
    summary: "Atualizar campanha",
    description:
      "Rota protegida. Apenas administradores podem atualizar campanhas próprias.",
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
        description: "Campanha atualizada com sucesso",
        content: {
          "application/json": {
            schema: campanhaResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos ou regra de negócio não atendida",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema.or(errorResponseSchema),
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão para atualizar esta campanha",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Campanha não encontrada",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/campanhas/{id}",
    tags: ["Campanhas"],
    summary: "Remover campanha",
    description:
      "Rota protegida. Apenas administradores podem remover campanhas próprias.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Campanha removida com sucesso",
        content: {
          "application/json": {
            schema: deleteResponseSchema,
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão para remover esta campanha",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Campanha não encontrada",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
