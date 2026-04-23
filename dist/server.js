import "dotenv/config";
import express from "express";
import usuarioRoutes from "./modules/usuario/usuario.routes.js";
const app = express();
app.use(express.json());
app.use("/usuarios", usuarioRoutes);
app.listen(3000, () => {
    console.log(" Servidor rodando na porta 3000");
});
//# sourceMappingURL=server.js.map