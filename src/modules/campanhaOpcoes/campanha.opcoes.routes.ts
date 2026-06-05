import { Router } from "express";
import { validate } from "../../utils/validate.js";
import { create, update } from "./campanha.opcoes.controller.js";

import * as campanhaOpcoesSchema from "./campanha.opcoes.schema.js";

const router = Router();

// CRIAR

router.post(
  "/",
  validate(campanhaOpcoesSchema.createCampanhaOpcoesSchema),
  create,
);
// ATUALIZAR

router.put(
  "/:id",
  validate(campanhaOpcoesSchema.updateCampanhaOpcoesSchema),
  update,
);

export default router;
