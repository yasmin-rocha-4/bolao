import { Router } from "express";
import { validate } from "../../utils/validate";
import {
  create,
  update,
} from "./aposta.controller";
import * as campanhaSchema from './aposta.schema'
const router = Router();


// CRIAR

router.post('/', validate(campanhaSchema.createApostaSchema), create);
// ATUALIZAR

router.put('/:id', validate(campanhaSchema.updateApostaSchema), update);



export default router;