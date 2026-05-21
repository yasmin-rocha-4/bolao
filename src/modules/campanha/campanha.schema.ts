import {z} from 'zod';
export const createCampanhaSchema = z.object({
  nome: z.string().min(3, "o nome deve ter no minimo 3 caracteres"),

  data_inicio: z.coerce.date(),
  data_fim: z.coerce.date(),

  tx_operacional: z.coerce.number(),
  valor_bolao: z.coerce.number(),

  is_publica: z.boolean(),
  codigo_campanha: z.string(),
  
  status: z.string().min(5, "O status deve ter no minimo 5 caracteres")
});
export const updateCampanhaSchema = z.object({
  nome: z.string().min(3, "o nome deve ter no minimo 3 caracteres").optional(),

  data_inicio: z.coerce.date().optional(),
  data_fim: z.coerce.date().optional(),

  tx_operacional: z.coerce.number().optional(),
  valor_bolao: z.coerce.number().optional(),

  is_publica: z.boolean().optional(),

  codigo_campanha: z.string().optional(),

  status: z.string().min(5, "O status deve ter no minimo 5 caracteres").optional()
});