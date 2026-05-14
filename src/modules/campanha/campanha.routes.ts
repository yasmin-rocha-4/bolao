import { Router } from "express";
import { validate } from "../../utils/validate";
import {
  create,
  update,
} from "./campanha.controller.js";
import * as campanhaSchema from './campanha.schema'
const router = Router();


// CRIAR

router.post('/', validate(campanhaSchema.createCampanhaSchema), create);
// ATUALIZAR

router.put('/:id', validate(campanhaSchema.updateCampanhaSchema), update);



export default router;