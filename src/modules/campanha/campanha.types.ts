import {z} from 'zod';
import { createCampanhaSchema } from './campanha.schema.js';

export type CreateCampanhaDTO = z.infer<typeof createCampanhaSchema>;