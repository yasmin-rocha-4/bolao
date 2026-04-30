import { Router } from "express";
import { validate } from "../../utils/validate.js";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "./usuario.controller.js";
import * as usuarioSchema from './usuario.schema.js'
const router = Router();

// LISTAR TODOS
router.get("/", getAll);

// BUSCAR POR ID
router.get("/:id", getById);

// CRIAR

router.post('/', validate(usuarioSchema.createUsuarioSchema), create);
// ATUALIZAR

router.put('/:id', validate(usuarioSchema.updateUsuarioSchema), update);


// DELETAR
router.delete("/:id", remove);

export default router;