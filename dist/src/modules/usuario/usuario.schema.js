"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsuarioSchema = exports.createUsuarioSchema = void 0;
const zod_1 = require("zod");
exports.createUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "o nome deve ter no minimo 3 caracteres"),
    email: zod_1.z.email("O email deve ser válido"),
    senha: zod_1.z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    cpf: zod_1.z.string().min(11, "O cpf deve ter no minimo 11 numeros"),
    telefone: zod_1.z.string().min(11, "O telefone deve ter no minimo 11 caracteres incluindo o ddd").optional(),
    tipo_usuario: zod_1.z.string().min(6, "O tipo de usuario deve ter no minimo 6 caracteres"),
    status: zod_1.z.string().min(5, "O status deve ter no minimo 5 caracteres")
});
exports.updateUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "o nome deve ter no minimo 3 caracteres").optional(),
    email: zod_1.z.email("O email deve ser válido").optional(),
    senha: zod_1.z.string().min(8, "A senha deve ter pelo menos 8 caracteres").optional(),
    telefone: zod_1.z.string().min(11, "O telefone deve ter no minimo 11 caracteres incluindo o ddd").optional(),
    status: zod_1.z.string().min(5, "O status deve ter no minimo 5 caracteres").optional()
});
