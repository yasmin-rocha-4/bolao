"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCampanhaPaths = registerCampanhaPaths;
const zod_1 = require("zod");
const campanha_schema_js_1 = require("./campanha.schema.js");
function registerCampanhaPaths(registry) {
    const campanhaResponseSchema = zod_1.z.object({
        id: zod_1.z.number(),
        nome: zod_1.z.string(),
        data_inicio: zod_1.z.date(),
        data_fim: zod_1.z.date(),
        tx_operacional: zod_1.z.number(),
        valor_bolao: zod_1.z.number(),
        is_publica: zod_1.z.boolean(),
        codigo_campanha: zod_1.z.string(),
        status: zod_1.z.string(),
    });
    const idParamsSchema = zod_1.z.object({
        id: zod_1.z.coerce.number().int().positive(),
    });
    registry.registerPath({
        method: "post",
        path: "/campanhas",
        tags: ["Campanhas"],
        summary: "Criar campanha",
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
                description: "Campanha criada",
                content: {
                    "application/json": {
                        schema: campanhaResponseSchema,
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
        path: "/campanhas/{id}",
        tags: ["Campanhas"],
        summary: "Atualizar campanha",
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
                description: "Campanha atualizada",
            },
            404: {
                description: "Campanha não encontrada",
            },
        },
    });
}
