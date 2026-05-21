import {z} from 'zod';
import { createCampanhaOpcoesSchema } from './campanha.opcoes.schema.js';

export type CreateUsuarioDTO = z.infer<typeof createCampanhaOpcoesSchema>;