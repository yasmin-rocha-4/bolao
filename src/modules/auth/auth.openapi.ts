import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { loginSchema } from "./auth.schema.js";

export function registerAuthPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    summary: "Realiza login do usuário",
    description:
      "Autentica um usuário cadastrado e retorna um token JWT para acesso às rotas protegidas.",
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login realizado com sucesso",
      },
      400: {
        description: "Dados inválidos",
      },
      401: {
        description: "E-mail ou senha inválidos",
      },
    },
  });
}
