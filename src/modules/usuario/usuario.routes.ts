import { Router } from "express";
import { validate } from "../../utils/validate";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "./usuario.controller.js";
import * as usuarioSchema from "./usuario.schema";
const router = Router();

// LISTAR TODOS
router.get("/", adminMiddleware, getAll);

// BUSCAR POR ID
router.get("/:id", adminMiddleware, getById);

// CRIAR

router.post("/", validate(usuarioSchema.createUsuarioSchema), create);
// ATUALIZAR

router.put("/:id", validate(usuarioSchema.updateUsuarioSchema), update);

// DELETAR
router.delete("/:id", remove);

export default router;
