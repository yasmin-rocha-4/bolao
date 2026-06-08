import { Router } from "express";
import { validate } from "../../utils/validate";
import { getAll, getById, create, update, remove } from "./campanha.controller";

import * as campanhaSchema from "./campanha.schema";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", validate(campanhaSchema.createCampanhaSchema), create);
router.put("/:id", validate(campanhaSchema.updateCampanhaSchema), update);
router.delete("/:id", remove);

export default router;
