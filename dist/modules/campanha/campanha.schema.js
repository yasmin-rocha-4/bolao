"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampanhaSchema = exports.createCampanhaSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.createCampanhaSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres.")
        .max(100, "O nome deve possuir no máximo 100 caracteres."),
    data_inicio: zod_1.z.coerce.date(),
    data_fim: zod_1.z.coerce.date(),
    tx_operacional: zod_1.z.coerce
        .number()
        .min(0, "A taxa operacional não pode ser negativa."),
    valor_bolao: zod_1.z.coerce
        .number()
        .positive("O valor do bolão deve ser maior que zero."),
    is_publica: zod_1.z.boolean(),
    codigo_campanha: zod_1.z
        .string()
        .trim()
        .min(3, "O código da campanha deve possuir pelo menos 3 caracteres.")
        .max(30, "O código da campanha deve possuir no máximo 30 caracteres."),
    status: zod_1.z.enum(["ATIVA", "INATIVA", "ENCERRADA"]),
});
exports.updateCampanhaSchema = exports.createCampanhaSchema.partial();
