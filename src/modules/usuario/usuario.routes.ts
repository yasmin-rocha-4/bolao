import { Router } from "express";
import { validate } from "../../utils/validate";
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

router.post("/", validate(usuarioSchema.createUsuarioSchema), create);

router.get("/", authMiddleware, getAll);

router.get("/:id", authMiddleware, getById);

router.put(
  "/:id",
  authMiddleware,
  validate(usuarioSchema.updateUsuarioSchema),
  update,
);

router.delete("/:id", authMiddleware, remove);

export default router;
