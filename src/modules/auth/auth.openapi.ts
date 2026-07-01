import { z } from "zod";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { loginSchema } from "./auth.schema.js";

const usuarioLogadoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string(),
  tipo_usuario: z.string(),
});

const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    usuario: usuarioLogadoSchema,
  }),
});

const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export function registerAuthPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/auth/login",
    tags: ["Auth"],
    summary: "Realiza login do usuário",
    description:
      "Autentica um usuário cadastrado e retorna um token JWT para acesso às rotas protegidas.",
    security: [],
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
        content: {
          "application/json": {
            schema: loginResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      401: {
        description: "E-mail ou senha inválidos",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
