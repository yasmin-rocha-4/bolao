"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCampanhaOpcoesPaths = registerCampanhaOpcoesPaths;
const zod_1 = require("zod");
const campanha_opcoes_schema_js_1 = require("./campanha.opcoes.schema.js");
function registerCampanhaOpcoesPaths(registry) {
    const idParamsSchema = zod_1.z.object({
        id: zod_1.z.coerce.number().int().positive(),
    });
    registry.registerPath({
        method: "post",
        path: "/campanha-opcoes",
        tags: ["Opções de Campanha"],
        summary: "Criar opção de campanha",
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
                description: "Opção criada",
            },
            400: {
                description: "Dados inválidos",
            },
            409: {
                description: "Opção duplicada",
            },
        },
    });
    registry.registerPath({
        method: "put",
        path: "/campanha-opcoes/{id}",
        tags: ["Opções de Campanha"],
        summary: "Atualizar opção de campanha",
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
                description: "Opção atualizada",
            },
            404: {
                description: "Opção não encontrada",
            },
        },
    });
}
