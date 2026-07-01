"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCampanhaOpcoesPaths = registerCampanhaOpcoesPaths;
const zod_1 = require("zod");
const campanha_opcoes_schema_js_1 = require("./campanha.opcoes.schema.js");
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
const campanhaOpcaoSchema = zod_1.z.object({
    id: zod_1.z.number(),
    campanha_id: zod_1.z.number(),
    descricao: zod_1.z.string(),
    status: zod_1.z.string(),
    eh_resultado_final: zod_1.z.boolean(),
    created_at: zod_1.z.string(),
    updated_at: zod_1.z.string(),
    campanha: zod_1.z
        .object({
        id: zod_1.z.number(),
        nome: zod_1.z.string(),
        status: zod_1.z.string(),
        is_publica: zod_1.z.boolean(),
        criador_id: zod_1.z.number(),
    })
        .optional(),
});
const campanhaOpcaoResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: campanhaOpcaoSchema,
});
const campanhaOpcoesResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: zod_1.z.array(campanhaOpcaoSchema),
});
const deleteResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
const idParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
function registerCampanhaOpcoesPaths(registry) {
    registry.registerPath({
        method: "get",
        path: "/campanha-opcoes",
        tags: ["Opções de Campanha"],
        summary: "Listar opções de campanha",
        description: "Rota protegida. Administradores visualizam opções das próprias campanhas; usuários comuns visualizam opções ativas de campanhas públicas.",
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
        description: "Rota protegida. A permissão depende do perfil do usuário e da campanha relacionada.",
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
        description: "Rota protegida. Apenas administradores podem criar opções para campanhas próprias.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: campanha_opcoes_schema_js_1.createCampanhaOpcoesSchema,
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
        description: "Rota protegida. Apenas administradores podem atualizar opções de campanhas próprias.",
        request: {
            params: idParamsSchema,
            body: {
                content: {
                    "application/json": {
                        schema: campanha_opcoes_schema_js_1.updateCampanhaOpcoesSchema,
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
        description: "Rota protegida. Apenas administradores podem remover opções de campanhas próprias.",
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
                description: "Não é possível remover esta opção porque existem apostas vinculadas a ela",
                content: {
                    "application/json": {
                        schema: errorResponseSchema,
                    },
                },
            },
        },
    });
}
