"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApostaPaths = registerApostaPaths;
const zod_1 = require("zod");
const aposta_schema_js_1 = require("./aposta.schema.js");
const errorResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
const validationErrorResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    errors: zod_1.z.array(zod_1.z.object({
        campo: zod_1.z.string(),
        mensagem: zod_1.z.string(),
    })),
});
const apostaSchema = zod_1.z.object({
    id: zod_1.z.number(),
    usuario_id: zod_1.z.number(),
    campanha_opcao_id: zod_1.z.number(),
    status: zod_1.z.string(),
    meio_pagamento: zod_1.z.string(),
    comprovante: zod_1.z.string().nullable().optional(),
    dt_criacao: zod_1.z.string(),
    usuario: zod_1.z
        .object({
        id: zod_1.z.number(),
        nome: zod_1.z.string(),
        email: zod_1.z.string(),
    })
        .optional(),
    campanhaOpcao: zod_1.z
        .object({
        id: zod_1.z.number(),
        descricao: zod_1.z.string(),
        eh_resultado_final: zod_1.z.boolean().optional(),
        campanha: zod_1.z
            .object({
            id: zod_1.z.number(),
            nome: zod_1.z.string(),
            criador_id: zod_1.z.number().optional(),
        })
            .optional(),
    })
        .optional(),
});
const apostaResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: apostaSchema,
});
const apostasResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: zod_1.z.array(apostaSchema),
});
const deleteResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
const idParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
function registerApostaPaths(registry) {
    registry.registerPath({
        method: "get",
        path: "/apostas",
        tags: ["Apostas"],
        summary: "Listar apostas",
        description: "Rota protegida. Usuários comuns visualizam suas próprias apostas; administradores visualizam apostas das campanhas que criaram.",
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
        description: "Rota protegida. Retorna apostas vinculadas às opções marcadas como resultado final.",
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
        description: "Rota protegida. Usuários comuns só podem acessar suas próprias apostas; administradores só acessam apostas das campanhas que criaram.",
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
        description: "Rota protegida. A aposta é vinculada automaticamente ao usuário autenticado.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: aposta_schema_js_1.createApostaSchema,
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
                description: "Dados inválidos, opção inativa ou campanha fora do período permitido",
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
        description: "Rota protegida. Usuários comuns só podem atualizar suas próprias apostas; administradores só atualizam apostas das campanhas que criaram.",
        request: {
            params: idParamsSchema,
            body: {
                content: {
                    "application/json": {
                        schema: aposta_schema_js_1.updateApostaSchema,
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
        description: "Rota protegida. Usuários comuns só podem remover suas próprias apostas; administradores só removem apostas das campanhas que criaram.",
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
