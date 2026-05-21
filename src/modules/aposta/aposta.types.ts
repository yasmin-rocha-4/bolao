import {z} from 'zod';
import { createApostaSchema } from './aposta.schema.js';

export type CreateCampanhaDTO = z.infer<typeof createApostaSchema>;