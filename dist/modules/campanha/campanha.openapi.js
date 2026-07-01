"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCampanhaPaths = registerCampanhaPaths;
const zod_1 = require("zod");
const campanha_schema_js_1 = require("./campanha.schema.js");
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
const campanhaSchema = zod_1.z.object({
    id: zod_1.z.number(),
    nome: zod_1.z.string(),
    data_inicio: zod_1.z.string(),
    data_fim: zod_1.z.string(),
    tx_operacional: zod_1.z.number(),
    valor_bolao: zod_1.z.number(),
    is_publica: zod_1.z.boolean(),
    codigo_campanha: zod_1.z.string(),
    status: zod_1.z.string(),
    criador_id: zod_1.z.number(),
});
const campanhaResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: campanhaSchema,
});
const campanhasResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: zod_1.z.array(campanhaSchema),
});
const deleteResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
const idParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
function registerCampanhaPaths(registry) {
    registry.registerPath({
        method: "get",
        path: "/campanhas",
        tags: ["Campanhas"],
        summary: "Listar campanhas",
        description: "Rota protegida. Administradores visualizam suas campanhas e usuários comuns visualizam campanhas públicas.",
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
        description: "Rota protegida. Administradores só acessam campanhas próprias; usuários comuns só acessam campanhas públicas disponíveis.",
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
        description: "Rota protegida. Apenas administradores podem criar campanhas.",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: campanha_schema_js_1.createCampanhaSchema,
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
        description: "Rota protegida. Apenas administradores podem atualizar campanhas próprias.",
        request: {
            params: idParamsSchema,
            body: {
                content: {
                    "application/json": {
                        schema: campanha_schema_js_1.updateCampanhaSchema,
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
        description: "Rota protegida. Apenas administradores podem remover campanhas próprias.",
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
