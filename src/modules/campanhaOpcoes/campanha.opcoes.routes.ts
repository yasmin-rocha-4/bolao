import { Router } from "express";
import { validate } from "../../utils/validate";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  create,
  update,
  findAll,
  findById,
  remove,
} from "./campanha.opcoes.controller.js";

import * as campanhaOpcoesSchema from "./campanha.opcoes.schema.js";

const router = Router();

router.get("/", authMiddleware, findAll);
router.get("/:id", authMiddleware, findById);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(campanhaOpcoesSchema.createCampanhaOpcoesSchema),
  create,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(campanhaOpcoesSchema.updateCampanhaOpcoesSchema),
  update,
);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;
