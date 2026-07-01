import { Router } from "express";
import { validate } from "../../utils/validate";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import {
  create,
  update,
  findAll,
  findById,
  remove,
} from "./campanha.opcoes.controller.js";

import * as campanhaOpcoesSchema from "./campanha.opcoes.schema.js";

const router = Router();

router.get("/", findAll);
router.get("/:id", findById);
router.post(
  "/",
  adminMiddleware,
  validate(campanhaOpcoesSchema.createCampanhaOpcoesSchema),
  create,
);
router.put(
  "/:id",
  adminMiddleware,
  validate(campanhaOpcoesSchema.updateCampanhaOpcoesSchema),
  update,
);
router.delete("/:id", adminMiddleware, remove);

export default router;
