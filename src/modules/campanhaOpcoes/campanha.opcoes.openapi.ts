import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  createCampanhaOpcoesSchema,
  updateCampanhaOpcoesSchema,
} from "./campanha.opcoes.schema.js";

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

const campanhaOpcaoSchema = z.object({
  id: z.number(),
  campanha_id: z.number(),
  descricao: z.string(),
  status: z.string(),
  eh_resultado_final: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  campanha: z
    .object({
      id: z.number(),
      nome: z.string(),
      status: z.string(),
      is_publica: z.boolean(),
      criador_id: z.number(),
    })
    .optional(),
});

const campanhaOpcaoResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: campanhaOpcaoSchema,
});

const campanhaOpcoesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(campanhaOpcaoSchema),
});

const deleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function registerCampanhaOpcoesPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/campanha-opcoes",
    tags: ["Opções de Campanha"],
    summary: "Listar opções de campanha",
    description:
      "Rota protegida. Administradores visualizam opções das próprias campanhas; usuários comuns visualizam opções ativas de campanhas públicas.",
    responses: {
      200: {
        description: "Opções encontradas com sucesso",
        content: {
          "application/json": {
            schema: campanhaOpcoesResponseSchema,
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
    path: "/campanha-opcoes/{id}",
    tags: ["Opções de Campanha"],
    summary: "Buscar opção de campanha por ID",
    description:
      "Rota protegida. A permissão depende do perfil do usuário e da campanha relacionada.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Opção encontrada com sucesso",
        content: {
          "application/json": {
            schema: campanhaOpcaoResponseSchema,
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
        description: "Usuário sem permissão para acessar esta opção",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Opção não encontrada",
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
    path: "/campanha-opcoes",
    tags: ["Opções de Campanha"],
    summary: "Criar opção de campanha",
    description:
      "Rota protegida. Apenas administradores podem criar opções para campanhas próprias.",
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
        description: "Opção criada com sucesso",
        content: {
          "application/json": {
            schema: campanhaOpcaoResponseSchema,
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
      409: {
        description: "Opção duplicada ou conflito de relacionamento",
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
    path: "/campanha-opcoes/{id}",
    tags: ["Opções de Campanha"],
    summary: "Atualizar opção de campanha",
    description:
      "Rota protegida. Apenas administradores podem atualizar opções de campanhas próprias.",
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
        description: "Opção atualizada com sucesso",
        content: {
          "application/json": {
            schema: campanhaOpcaoResponseSchema,
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
        description: "Usuário sem permissão para atualizar esta opção",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Opção não encontrada",
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
    path: "/campanha-opcoes/{id}",
    tags: ["Opções de Campanha"],
    summary: "Remover opção de campanha",
    description:
      "Rota protegida. Apenas administradores podem remover opções de campanhas próprias.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Opção removida com sucesso",
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
        description: "Usuário sem permissão para remover esta opção",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Opção não encontrada",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      409: {
        description:
          "Não é possível remover esta opção porque existem apostas vinculadas a ela",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
