import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApostaSchema, updateApostaSchema } from "./aposta.schema.js";

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

const apostaSchema = z.object({
  id: z.number(),
  usuario_id: z.number(),
  campanha_opcao_id: z.number(),
  status: z.string(),
  meio_pagamento: z.string(),
  comprovante: z.string().nullable().optional(),
  dt_criacao: z.string(),
  usuario: z
    .object({
      id: z.number(),
      nome: z.string(),
      email: z.string(),
    })
    .optional(),
  campanhaOpcao: z
    .object({
      id: z.number(),
      descricao: z.string(),
      eh_resultado_final: z.boolean().optional(),
      campanha: z
        .object({
          id: z.number(),
          nome: z.string(),
          criador_id: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});

const apostaResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: apostaSchema,
});

const apostasResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(apostaSchema),
});

const deleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function registerApostaPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "get",
    path: "/apostas",
    tags: ["Apostas"],
    summary: "Listar apostas",
    description:
      "Rota protegida. Usuários comuns visualizam suas próprias apostas; administradores visualizam apostas das campanhas que criaram.",
    responses: {
      200: {
        description: "Apostas encontradas com sucesso",
        content: {
          "application/json": {
            schema: apostasResponseSchema,
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
    path: "/apostas/vencedores",
    tags: ["Apostas"],
    summary: "Listar vencedores do bolão",
    description:
      "Rota protegida. Retorna apostas vinculadas às opções marcadas como resultado final.",
    responses: {
      200: {
        description: "Vencedores encontrados com sucesso",
        content: {
          "application/json": {
            schema: apostasResponseSchema,
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
    path: "/apostas/{id}",
    tags: ["Apostas"],
    summary: "Buscar aposta por ID",
    description:
      "Rota protegida. Usuários comuns só podem acessar suas próprias apostas; administradores só acessam apostas das campanhas que criaram.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Aposta encontrada com sucesso",
        content: {
          "application/json": {
            schema: apostaResponseSchema,
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
        description: "Usuário sem permissão para acessar esta aposta",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Aposta não encontrada",
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
    path: "/apostas",
    tags: ["Apostas"],
    summary: "Criar aposta",
    description:
      "Rota protegida. A aposta é vinculada automaticamente ao usuário autenticado.",
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
        description: "Aposta criada com sucesso",
        content: {
          "application/json": {
            schema: apostaResponseSchema,
          },
        },
      },
      400: {
        description:
          "Dados inválidos, opção inativa ou campanha fora do período permitido",
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
      404: {
        description: "Opção da campanha não encontrada",
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
    path: "/apostas/{id}",
    tags: ["Apostas"],
    summary: "Atualizar aposta",
    description:
      "Rota protegida. Usuários comuns só podem atualizar suas próprias apostas; administradores só atualizam apostas das campanhas que criaram.",
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
        description: "Aposta atualizada com sucesso",
        content: {
          "application/json": {
            schema: apostaResponseSchema,
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
        description: "Usuário sem permissão para atualizar esta aposta",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Aposta não encontrada",
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
    path: "/apostas/{id}",
    tags: ["Apostas"],
    summary: "Remover aposta",
    description:
      "Rota protegida. Usuários comuns só podem remover suas próprias apostas; administradores só removem apostas das campanhas que criaram.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Aposta removida com sucesso",
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
        description: "Usuário sem permissão para remover esta aposta",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Aposta não encontrada",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
