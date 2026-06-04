import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { registerUsuarioPaths } from "../modules/usuario/usuario.openapi.js";
import { registerCampanhaPaths } from "../modules/campanha/campanha.openapi.js";
import { registerCampanhaOpcoesPaths } from "../modules/campanhaOpcoes/campanha.opcoes.openapi.js";
import { registerApostaPaths } from "../modules/aposta/aposta.openapi.js";

const registry = new OpenAPIRegistry();

registerUsuarioPaths(registry);
registerCampanhaPaths(registry);
registerCampanhaOpcoesPaths(registry);
registerApostaPaths(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API Bolão da Copa",
    version: "1.0.0",
    description:
      "API para gerenciamento de usuários, campanhas, opções de campanha e apostas.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local de desenvolvimento",
    },
  ],
});
