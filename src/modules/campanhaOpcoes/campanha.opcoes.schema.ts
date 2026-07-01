import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createCampanhaOpcoesSchema = z.object({
  campanha_id: z.coerce
    .number()
    .int()
    .positive("Selecione uma campanha válida."),

  descricao: z
    .string()
    .trim()
    .min(3, "A descrição deve possuir pelo menos 3 caracteres.")
    .max(100, "A descrição deve possuir no máximo 100 caracteres."),

  status: z.enum(["ATIVA", "INATIVA"]),

  eh_resultado_final: z.boolean().default(false),
});

export const updateCampanhaOpcoesSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(3, "A descrição deve possuir pelo menos 3 caracteres.")
    .max(100, "A descrição deve possuir no máximo 100 caracteres.")
    .optional(),

  status: z.enum(["ATIVA", "INATIVA"]).optional(),

  eh_resultado_final: z.boolean().optional(),
});

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
