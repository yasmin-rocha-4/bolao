import { z } from "zod";

export const createApostaSchema = z.object({
  usuario_id: z
    .number({
      error: "O id do usuário deve ser um número"
    })
    .int("O id do usuário deve ser um inteiro positivo")
    .positive("O id do usuário deve ser maior que zero"),

  campanha_opcao_id: z
    .number({
      error: "O id da opção da campanha deve ser um número"
    })
    .int("O id da opção da campanha deve ser um inteiro positivo")
    .positive("O id da opção da campanha deve ser maior que zero"),

  meio_pagamento: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"], {
    error: "Meio de pagamento inválido"
  }),

  status: z
    .string()
    .min(3, "O status deve ter no mínimo 3 caracteres"),

  comprovante: z
    .string()
    .optional()
});

export const updateApostaSchema = z.object({
  status: z
    .string()
    .min(3, "O status deve ter no mínimo 3 caracteres")
    .optional(),

  meio_pagamento: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"]).optional(),

  comprovante: z.string().optional()
});