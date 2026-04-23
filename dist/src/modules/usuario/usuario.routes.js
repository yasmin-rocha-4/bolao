import { Router } from "express";
import { getAll, getById, create, update, remove, } from "./usuario.controller.js";
const router = Router();
// LISTAR TODOS
router.get("/", getAll);
// BUSCAR POR ID
router.get("/:id", getById);
// CRIAR
router.post("/", create);
// ATUALIZAR
router.put("/:id", update);
// DELETAR
router.delete("/:id", remove);
export default router;
//# sourceMappingURL=usuario.routes.js.map