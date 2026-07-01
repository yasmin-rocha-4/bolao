"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamsSchema = exports.updateCampanhaOpcoesSchema = exports.createCampanhaOpcoesSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.createCampanhaOpcoesSchema = zod_1.z.object({
    campanha_id: zod_1.z.coerce
        .number()
        .int()
        .positive("Selecione uma campanha válida."),
    descricao: zod_1.z
        .string()
        .trim()
        .min(3, "A descrição deve possuir pelo menos 3 caracteres.")
        .max(100, "A descrição deve possuir no máximo 100 caracteres."),
    status: zod_1.z.enum(["ATIVA", "INATIVA"]),
    eh_resultado_final: zod_1.z.boolean().default(false),
});
exports.updateCampanhaOpcoesSchema = zod_1.z.object({
    descricao: zod_1.z
        .string()
        .trim()
        .min(3, "A descrição deve possuir pelo menos 3 caracteres.")
        .max(100, "A descrição deve possuir no máximo 100 caracteres.")
        .optional(),
    status: zod_1.z.enum(["ATIVA", "INATIVA"]).optional(),
    eh_resultado_final: zod_1.z.boolean().optional(),
});
exports.idParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
