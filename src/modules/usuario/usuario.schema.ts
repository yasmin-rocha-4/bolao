import {z} from 'zod';

export const createUsuarioSchema = z.object({
    nome: z.string().min(3, "o nome deve ter no minimo 3 caracteres"),
    email: z.email("O email deve ser válido"),
    senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    cpf: z.string().min(11, "O cpf deve ter no minimo 11 numeros"),
    telefone: z.string().min(11, "O telefone deve ter no minimo 11 caracteres incluindo o ddd").optional(),
    tipoUsuario: z.string().min(6, "O tipo de usuario deve ter no minimo 6 caracteres"),
    status: z.string().min(5, "O status deve ter no minimo 5 caracteres")
});

export const updateUsuarioSchema = z.object({
    nome: z.string().min(3, "o nome deve ter no minimo 3 caracteres").optional(),
    email: z.email("O email deve ser válido").optional(),
    senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres").optional(),
    telefone: z.string().min(11, "O telefone deve ter no minimo 11 caracteres incluindo o ddd").optional(),
    status: z.string().min(5, "O status deve ter no minimo 5 caracteres").optional()
});