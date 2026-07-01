import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const createCampanhaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve possuir pelo menos 3 caracteres.")
    .max(100, "O nome deve possuir no máximo 100 caracteres."),

  data_inicio: z.coerce.date(),

  data_fim: z.coerce.date(),

  tx_operacional: z.coerce
    .number()
    .min(0, "A taxa operacional não pode ser negativa."),

  valor_bolao: z.coerce
    .number()
    .positive("O valor do bolão deve ser maior que zero."),

  is_publica: z.boolean(),

  codigo_campanha: z
    .string()
    .trim()
    .min(3, "O código da campanha deve possuir pelo menos 3 caracteres.")
    .max(30, "O código da campanha deve possuir no máximo 30 caracteres."),

  status: z.enum(["ATIVA", "INATIVA", "ENCERRADA"]),
});

export const updateCampanhaSchema = createCampanhaSchema.partial();
