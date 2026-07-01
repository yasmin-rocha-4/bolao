"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUsuarioPaths = registerUsuarioPaths;
const zod_1 = require("zod");
const usuario_schema_js_1 = require("./usuario.schema.js");
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
const usuarioSchema = zod_1.z.object({
    id: zod_1.z.number(),
    nome: zod_1.z.string(),
    cpf: zod_1.z.string(),
    email: zod_1.z.string(),
    telefone: zod_1.z.string().nullable(),
    tipo_usuario: zod_1.z.string(),
    senha: zod_1.z.string(),
    status: zod_1.z.string(),
});
const usuarioResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: usuarioSchema,
});
const usuariosResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: zod_1.z.array(usuarioSchema),
});
const idParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
function registerUsuarioPaths(registry) {
    registry.registerPath({
        method: "post",
        path: "/usuarios",
        tags: ["Usuários"],
        summary: "Criar usuário",
        description: "Rota pública usada para cadastro de novos usuários.",
        security: [],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: usuario_schema_js_1.createUsuarioSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Usuário criado com sucesso",
                content: {
                    "application/json": {
                        schema: usuarioResponseSchema,
                    },
                },
            },
            400: {
                description: "Dados inválidos ou e-mail já cadastrado",
                content: {
                    "application/json": {
                        schema: validationErrorResponseSchema.or(errorResponseSchema),
                    },
                },
            },
        },
    });
    registry.registerPath({
        method: "get",
        path: "/usuarios",
        tags: ["Usuários"],
        summary: "Listar usuários",
        description: "Rota protegida. Apenas administradores podem listar usuários.",
        responses: {
            200: {
                description: "Usuários encontrados com sucesso",
                content: {
                    "application/json": {
                        schema: usuariosResponseSchema,
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
                description: "Usuário sem permissão",
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
        path: "/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Buscar usuário por ID",
        description: "Rota protegida. Usuários comuns só podem acessar o próprio perfil.",
        request: {
            params: idParamsSchema,
        },
        responses: {
            200: {
                description: "Usuário encontrado com sucesso",
                content: {
                    "application/json": {
                        schema: usuarioResponseSchema,
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
                description: "Usuário sem permissão",
                content: {
                    "application/json": {
                        schema: errorResponseSchema,
                    },
                },
            },
            404: {
                description: "Usuário não encontrado",
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
        path: "/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Atualizar usuário",
        description: "Rota protegida. Usuários comuns só podem atualizar o próprio perfil.",
        request: {
            params: idParamsSchema,
            body: {
                content: {
                    "application/json": {
                        schema: usuario_schema_js_1.updateUsuarioSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Usuário atualizado com sucesso",
                content: {
                    "application/json": {
                        schema: usuarioResponseSchema,
                    },
                },
            },
            400: {
                description: "Dados inválidos",
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
                description: "Usuário sem permissão",
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
        path: "/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Remover usuário",
        description: "Rota protegida. Usuários comuns só podem excluir o próprio perfil.",
        request: {
            params: idParamsSchema,
        },
        responses: {
            200: {
                description: "Usuário removido com sucesso",
                content: {
                    "application/json": {
                        schema: zod_1.z.object({
                            success: zod_1.z.boolean(),
                            message: zod_1.z.string(),
                        }),
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
                description: "Usuário sem permissão",
                content: {
                    "application/json": {
                        schema: errorResponseSchema,
                    },
                },
            },
            404: {
                description: "Usuário não encontrado",
                content: {
                    "application/json": {
                        schema: errorResponseSchema,
                    },
                },
            },
        },
    });
}
