import "dotenv/config";
import express from "express";
import * as swaggerUi from "swagger-ui-express";

import usuarioRoutes from "./modules/usuario/usuario.routes.js";
import campanhaRoutes from "./modules/campanha/campanha.routes.js";
import campanhaOpcoesRoutes from "./modules/campanhaOpcoes/campanha.opcoes.routes.js";
import apostaRoutes from "./modules/aposta/aposta.routes.js";

import { openApiDocument } from "./utils/openapi.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/campanhas", campanhaRoutes);
app.use("/campanha-opcoes", campanhaOpcoesRoutes);
app.use("/apostas", apostaRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/docs`);
});
