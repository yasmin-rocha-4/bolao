"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiDocument = void 0;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const usuario_openapi_js_1 = require("../modules/usuario/usuario.openapi.js");
const campanha_openapi_js_1 = require("../modules/campanha/campanha.openapi.js");
const campanha_opcoes_openapi_js_1 = require("../modules/campanhaOpcoes/campanha.opcoes.openapi.js");
const aposta_openapi_js_1 = require("../modules/aposta/aposta.openapi.js");
const auth_openapi_js_1 = require("../modules/auth/auth.openapi.js");
const registry = new zod_to_openapi_1.OpenAPIRegistry();
registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Informe o token JWT obtido no login.",
});
(0, auth_openapi_js_1.registerAuthPaths)(registry);
(0, usuario_openapi_js_1.registerUsuarioPaths)(registry);
(0, campanha_openapi_js_1.registerCampanhaPaths)(registry);
(0, campanha_opcoes_openapi_js_1.registerCampanhaOpcoesPaths)(registry);
(0, aposta_openapi_js_1.registerApostaPaths)(registry);
const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry.definitions);
exports.openApiDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "API Bolão da Copa",
        version: "1.0.0",
        description: "API para gerenciamento de autenticação, usuários, campanhas, opções de campanha, apostas e vencedores do bolão.",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor local de desenvolvimento",
        },
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
});
