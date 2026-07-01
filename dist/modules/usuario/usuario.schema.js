"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsuarioSchema = exports.createUsuarioSchema = void 0;
const zod_1 = require("zod");
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
exports.createUsuarioSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres.")
        .max(100, "O nome deve possuir no máximo 100 caracteres."),
    email: zod_1.z.string().trim().email("Informe um e-mail válido."),
    senha: zod_1.z
        .string()
        .min(8, "A senha deve possuir pelo menos 8 caracteres.")
        .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número."),
    cpf: zod_1.z
        .string()
        .trim()
        .regex(/^\d{11}$/, "CPF deve conter exatamente 11 números."),
    telefone: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10,11}$/, "Telefone inválido.")
        .optional(),
    tipo_usuario: zod_1.z.enum(["cliente", "administrador"]).default("cliente"),
});
exports.updateUsuarioSchema = zod_1.z.object({
    nome: zod_1.z
        .string()
        .trim()
        .min(3, "O nome deve possuir pelo menos 3 caracteres.")
        .max(100, "O nome deve possuir no máximo 100 caracteres.")
        .optional(),
    email: zod_1.z.string().trim().email("Informe um e-mail válido.").optional(),
    senha: zod_1.z
        .string()
        .min(8, "A senha deve possuir pelo menos 8 caracteres.")
        .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
        .optional(),
    telefone: zod_1.z
        .string()
        .trim()
        .regex(/^\d{10,11}$/, "Telefone inválido.")
        .optional(),
    status: zod_1.z.enum(["ATIVO", "INATIVO"]).optional(),
});
