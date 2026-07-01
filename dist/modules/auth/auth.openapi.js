"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthPaths = registerAuthPaths;
const zod_1 = require("zod");
const auth_schema_js_1 = require("./auth.schema.js");
const usuarioLogadoSchema = zod_1.z.object({
    id: zod_1.z.number(),
    nome: zod_1.z.string(),
    email: zod_1.z.string(),
    tipo_usuario: zod_1.z.string(),
});
const loginResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    data: zod_1.z.object({
        token: zod_1.z.string(),
        usuario: usuarioLogadoSchema,
    }),
});
const errorResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
function registerAuthPaths(registry) {
    registry.registerPath({
        method: "post",
        path: "/auth/login",
        tags: ["Auth"],
        summary: "Realiza login do usuário",
        description: "Autentica um usuário cadastrado e retorna um token JWT para acesso às rotas protegidas.",
        security: [],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: auth_schema_js_1.loginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Login realizado com sucesso",
                content: {
                    "application/json": {
                        schema: loginResponseSchema,
                    },
                },
            },
            400: {
                description: "Dados inválidos",
                content: {
                    "application/json": {
                        schema: errorResponseSchema,
                    },
                },
            },
            401: {
                description: "E-mail ou senha inválidos",
                content: {
                    "application/json": {
                        schema: errorResponseSchema,
                    },
                },
            },
        },
    });
}
