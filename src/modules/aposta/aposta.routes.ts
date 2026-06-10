import { Router } from "express";
import { validate } from "../../utils/validate.js";
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

router.get("/", getAll);
router.get("/vencedores", getAllVencedores);
router.get("/:id", getById);
router.post("/", validate(apostaSchema.createApostaSchema), create);
router.put("/:id", validate(apostaSchema.updateApostaSchema), update);
router.delete("/:id", remove);

export default router;
