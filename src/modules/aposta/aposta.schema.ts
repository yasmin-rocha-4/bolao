import { z } from "zod";
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
export const createApostaSchema = z.object({
  campanha_opcao_id: z.number().int().positive(),

  meio_pagamento: z.enum([
    "PIX",
    "CARTAO_CREDITO",
    "CARTAO_DEBITO",
    "BOLETO",
  ]),

  status: z.string().min(3, "O status deve ter no mínimo 3 caracteres"),

  comprovante: z.string().optional(),
});
export const updateApostaSchema = z.object({
  status: z
    .string()
    .min(3, "O status deve ter no mínimo 3 caracteres")
    .optional(),

  meio_pagamento: z
    .enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"])
    .optional(),

  comprovante: z.string().optional(),
});
extendZodWithOpenApi(z);
