import { Router } from "express";
import { validate } from "../../utils/validate";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getAll, getById, create, update, remove } from "./campanha.controller";

import * as campanhaSchema from "./campanha.schema";

const router = Router();

router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getById);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(campanhaSchema.createCampanhaSchema),
  create,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(campanhaSchema.updateCampanhaSchema),
  update,
);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

export default router;
