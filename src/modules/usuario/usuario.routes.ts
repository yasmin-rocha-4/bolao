import { Router } from "express";
import { validate } from "../../utils/validate";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
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
router.get("/", authMiddleware, adminMiddleware, getAll);

// BUSCAR POR ID
router.get("/:id", authMiddleware, adminMiddleware, getById);

// CRIAR

router.post(
  "/",
  authMiddleware,
  validate(usuarioSchema.createUsuarioSchema),
  create,
);
// ATUALIZAR

router.put(
  "/:id",
  authMiddleware,
  validate(usuarioSchema.updateUsuarioSchema),
  update,
);

// DELETAR
router.delete("/:id", authMiddleware, remove);

export default router;
