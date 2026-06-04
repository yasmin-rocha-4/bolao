import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createUsuarioSchema, updateUsuarioSchema } from "./usuario.schema.js";

export function registerUsuarioPaths(registry: OpenAPIRegistry) {
  const errorSchema = z.object({
    mensagem: z.string(),
  });

  const usuarioResponseSchema = z.object({
    id: z.number(),
    nome: z.string(),
    cpf: z.string(),
    email: z.string(),
    telefone: z.string().nullable(),
    tipo_usuario: z.string(),
    senha: z.string(),
    status: z.string(),
  });

  const idParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  registry.registerPath({
    method: "get",
    path: "/usuarios",
    tags: ["Usuários"],
    summary: "Listar usuários",
    responses: {
      200: {
        description: "Lista de usuários",
        content: {
          "application/json": {
            schema: z.array(usuarioResponseSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Buscar usuário por ID",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Usuário encontrado",
        content: {
          "application/json": {
            schema: usuarioResponseSchema,
          },
        },
      },
      404: {
        description: "Usuário não encontrado",
        content: {
          "application/json": {
            schema: errorSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/usuarios",
    tags: ["Usuários"],
    summary: "Criar usuário",
    request: {
      body: {
        content: {
          "application/json": {
            schema: createUsuarioSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Usuário criado",
        content: {
          "application/json": {
            schema: usuarioResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos",
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Atualizar usuário",
    request: {
      params: idParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: updateUsuarioSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Usuário atualizado",
      },
      404: {
        description: "Usuário não encontrado",
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Remover usuário",
    request: {
      params: idParamsSchema,
    },
    responses: {
      204: {
        description: "Usuário removido",
      },
      404: {
        description: "Usuário não encontrado",
      },
    },
  });
}
