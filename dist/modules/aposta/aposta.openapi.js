"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApostaPaths = registerApostaPaths;
const zod_1 = require("zod");
const aposta_schema_js_1 = require("./aposta.schema.js");
function registerApostaPaths(registry) {
    const idParamsSchema = zod_1.z.object({
        id: zod_1.z.coerce.number().int().positive(),
    });
    registry.registerPath({
        method: "post",
        path: "/apostas",
        tags: ["Apostas"],
        summary: "Criar aposta",
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
                description: "Aposta criada",
            },
            400: {
                description: "Dados inválidos ou campanha fora do período",
            },
            403: {
                description: "Campanha privada",
            },
            404: {
                description: "Opção da campanha não encontrada",
            },
        },
    });
    registry.registerPath({
        method: "put",
        path: "/apostas/{id}",
        tags: ["Apostas"],
        summary: "Atualizar aposta",
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
                description: "Aposta atualizada",
            },
            404: {
                description: "Aposta não encontrada",
            },
        },
    });
}
