import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createApostaSchema = z.object({
  campanha_opcao_id: z.coerce
    .number()
    .int()
    .positive("Selecione uma opção de campanha válida."),

  meio_pagamento: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"]),

  status: z.enum(["PENDENTE", "PAGO", "CANCELADA"]),

  comprovante: z.string().trim().optional(),
});

export const updateApostaSchema = z.object({
  status: z.enum(["PENDENTE", "PAGO", "CANCELADA"]).optional(),

  meio_pagamento: z
    .enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"])
    .optional(),

  comprovante: z.string().trim().optional(),
});
