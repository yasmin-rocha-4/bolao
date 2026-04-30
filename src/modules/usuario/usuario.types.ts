import {z} from 'zod';
import { createUsuarioSchema } from './usuario.schema.js';

export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;