import "dotenv/config";
import "./utils/zodErrorMap";
import express from "express";
import * as swaggerUi from "swagger-ui-express";
import cors from "cors";

import usuarioRoutes from "./modules/usuario/usuario.routes";
import campanhaRoutes from "./modules/campanha/campanha.routes";
import campanhaOpcoesRoutes from "./modules/campanhaOpcoes/campanha.opcoes.routes";
import apostaRoutes from "./modules/aposta/aposta.routes";
import authRoutes from "./modules/auth/auth.routes";
import { openApiDocument } from "./utils/openapi";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);

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
