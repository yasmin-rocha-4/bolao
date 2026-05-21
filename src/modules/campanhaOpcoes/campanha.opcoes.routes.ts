import { Router } from "express";
import { validate } from "../../utils/validate";
import {
  create,
  update,
} from "./campanha.opcoes.controller";
import * as campanhaOpcoesSchema from './campanha.opcoes.schema'
const router = Router();


// CRIAR

router.post('/', validate(campanhaOpcoesSchema.createCampanhaOpcoesSchema), create);
// ATUALIZAR

router.put('/:id', validate(campanhaOpcoesSchema.updateCampanhaOpcoesSchema), update);



export default router;