"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApostaSchema = exports.createApostaSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
exports.createApostaSchema = zod_1.z.object({
    campanha_opcao_id: zod_1.z.number().int().positive(),
    meio_pagamento: zod_1.z.enum([
        "PIX",
        "CARTAO_CREDITO",
        "CARTAO_DEBITO",
        "BOLETO",
    ]),
    status: zod_1.z.string().min(3, "O status deve ter no mínimo 3 caracteres"),
    comprovante: zod_1.z.string().optional(),
});
exports.updateApostaSchema = zod_1.z.object({
    status: zod_1.z
        .string()
        .min(3, "O status deve ter no mínimo 3 caracteres")
        .optional(),
    meio_pagamento: zod_1.z
        .enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"])
        .optional(),
    comprovante: zod_1.z.string().optional(),
});
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
