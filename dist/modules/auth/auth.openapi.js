"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthPaths = registerAuthPaths;
const auth_schema_js_1 = require("./auth.schema.js");
function registerAuthPaths(registry) {
    registry.registerPath({
        method: "post",
        path: "/auth/login",
        tags: ["Auth"],
        summary: "Realiza login do usuário",
        description: "Autentica um usuário cadastrado e retorna um token JWT para acesso às rotas protegidas.",
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
            },
            400: {
                description: "Dados inválidos",
            },
            401: {
                description: "E-mail ou senha inválidos",
            },
        },
    });
}
