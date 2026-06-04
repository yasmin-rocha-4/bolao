"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampanhaSchema = exports.createCampanhaSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
exports.createCampanhaSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "o nome deve ter no minimo 3 caracteres"),
    data_inicio: zod_1.z.coerce.date(),
    data_fim: zod_1.z.coerce.date(),
    tx_operacional: zod_1.z.coerce.number(),
    valor_bolao: zod_1.z.coerce.number(),
    is_publica: zod_1.z.boolean(),
    codigo_campanha: zod_1.z.string(),
    status: zod_1.z.string().min(5, "O status deve ter no minimo 5 caracteres"),
});
exports.updateCampanhaSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "o nome deve ter no minimo 3 caracteres").optional(),
    data_inicio: zod_1.z.coerce.date().optional(),
    data_fim: zod_1.z.coerce.date().optional(),
    tx_operacional: zod_1.z.coerce.number().optional(),
    valor_bolao: zod_1.z.coerce.number().optional(),
    is_publica: zod_1.z.boolean().optional(),
    codigo_campanha: zod_1.z.string().optional(),
    status: zod_1.z
        .string()
        .min(5, "O status deve ter no minimo 5 caracteres")
        .optional(),
});
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
