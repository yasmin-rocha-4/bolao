"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUsuarioPaths = registerUsuarioPaths;
const zod_1 = require("zod");
const usuario_schema_js_1 = require("./usuario.schema.js");
function registerUsuarioPaths(registry) {
    const errorSchema = zod_1.z.object({
        mensagem: zod_1.z.string(),
    });
    const usuarioResponseSchema = zod_1.z.object({
        id: zod_1.z.number(),
        nome: zod_1.z.string(),
        cpf: zod_1.z.string(),
        email: zod_1.z.string(),
        telefone: zod_1.z.string().nullable(),
        tipo_usuario: zod_1.z.string(),
        senha: zod_1.z.string(),
        status: zod_1.z.string(),
    });
    const idParamsSchema = zod_1.z.object({
        id: zod_1.z.coerce.number().int().positive(),
    });
    registry.registerPath({
        method: "get",
        path: "/usuarios",
        tags: ["Usuários"],
        summary: "Listar usuários",
        responses: {
            200: {
                description: "Lista de usuários",
                content: {
                    "application/json": {
                        schema: zod_1.z.array(usuarioResponseSchema),
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
        request: {
            params: idParamsSchema,
        },
        responses: {
            200: {
                description: "Usuário encontrado",
                content: {
                    "application/json": {
                        schema: usuarioResponseSchema,
                    },
                },
            },
            404: {
                description: "Usuário não encontrado",
                content: {
                    "application/json": {
                        schema: errorSchema,
                    },
                },
            },
        },
    });
    registry.registerPath({
        method: "post",
        path: "/usuarios",
        tags: ["Usuários"],
        summary: "Criar usuário",
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
                description: "Usuário criado",
                content: {
                    "application/json": {
                        schema: usuarioResponseSchema,
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
        path: "/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Atualizar usuário",
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
                description: "Usuário atualizado",
            },
            404: {
                description: "Usuário não encontrado",
            },
        },
    });
    registry.registerPath({
        method: "delete",
        path: "/usuarios/{id}",
        tags: ["Usuários"],
        summary: "Remover usuário",
        request: {
            params: idParamsSchema,
        },
        responses: {
            204: {
                description: "Usuário removido",
            },
            404: {
                description: "Usuário não encontrado",
            },
        },
    });
}
