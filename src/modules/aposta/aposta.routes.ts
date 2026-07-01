import { Router } from "express";
import { validate } from "../../utils/validate.js";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getAll,
  getById,
  getAllVencedores,
  create,
  update,
  remove,
} from "./aposta.controller";

import * as apostaSchema from "./aposta.schema.js";

const router = Router();

router.get("/", authMiddleware, getAll);
router.get("/vencedores", authMiddleware, getAllVencedores);
router.get("/:id", authMiddleware, getById);
router.post(
  "/",
  authMiddleware,
  validate(apostaSchema.createApostaSchema),
  create,
);
router.put(
  "/:id",
  authMiddleware,
  validate(apostaSchema.updateApostaSchema),
  update,
);
router.delete("/:id", authMiddleware, remove);

export default router;
