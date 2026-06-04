"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamsSchema = exports.updateCampanhaOpcoesSchema = exports.createCampanhaOpcoesSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
exports.createCampanhaOpcoesSchema = zod_1.z.object({
    campanha_id: zod_1.z.coerce
        .number()
        .int("O id da campanha deve ser um número inteiro")
        .positive("O id da campanha deve ser maior que zero"),
    descricao: zod_1.z.string().min(3, "A descrição deve ter no minimo 3 caracteres"),
    status: zod_1.z.string().min(5, "O status deve ter no minimo 5 caracteres"),
    eh_resultado_final: zod_1.z.boolean().optional().default(false),
});
exports.updateCampanhaOpcoesSchema = zod_1.z.object({
    descricao: zod_1.z
        .string()
        .min(3, "A descrição deve ter no minimo 3 caracteres")
        .optional(),
    status: zod_1.z
        .string()
        .min(5, "O status deve ter no minimo 5 caracteres")
        .optional(),
    eh_resultado_final: zod_1.z.boolean().optional(),
});
exports.idParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().positive(),
});
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
