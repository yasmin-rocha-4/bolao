import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createUsuarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve possuir pelo menos 3 caracteres.")
    .max(100, "O nome deve possuir no máximo 100 caracteres."),

  email: z.string().trim().email("Informe um e-mail válido."),

  senha: z
    .string()
    .min(8, "A senha deve possuir pelo menos 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número."),

  cpf: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "CPF deve conter exatamente 11 números."),

  telefone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Telefone inválido.")
    .optional(),

  tipo_usuario: z.enum(["cliente", "administrador"]).default("cliente"),
});

export const updateUsuarioSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve possuir pelo menos 3 caracteres.")
    .max(100, "O nome deve possuir no máximo 100 caracteres.")
    .optional(),

  email: z.string().trim().email("Informe um e-mail válido.").optional(),

  senha: z
    .string()
    .min(8, "A senha deve possuir pelo menos 8 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
    .optional(),

  telefone: z
    .string()
    .trim()
    .regex(/^\d{10,11}$/, "Telefone inválido.")
    .optional(),

  status: z.enum(["ATIVO", "INATIVO"]).optional(),
});
