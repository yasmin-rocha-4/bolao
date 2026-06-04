import { z } from "zod";
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
export const createCampanhaOpcoesSchema = z.object({
  campanha_id: z.coerce
    .number()
    .int("O id da campanha deve ser um número inteiro")
    .positive("O id da campanha deve ser maior que zero"),

  descricao: z.string().min(3, "A descrição deve ter no minimo 3 caracteres"),

  status: z.string().min(5, "O status deve ter no minimo 5 caracteres"),

  eh_resultado_final: z.boolean().optional().default(false),
});

export const updateCampanhaOpcoesSchema = z.object({
  descricao: z
    .string()
    .min(3, "A descrição deve ter no minimo 3 caracteres")
    .optional(),

  status: z
    .string()
    .min(5, "O status deve ter no minimo 5 caracteres")
    .optional(),

  eh_resultado_final: z.boolean().optional(),
});

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
extendZodWithOpenApi(z);
