import { Router } from "express";
import { validate } from "../../utils/validate.js";
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
  validate(campanhaOpcoesSchema.createCampanhaOpcoesSchema),
  create,
);
router.put(
  "/:id",
  validate(campanhaOpcoesSchema.updateCampanhaOpcoesSchema),
  update,
);
router.delete("/:id", remove);

export default router;
