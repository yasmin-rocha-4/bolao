import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createUsuarioSchema, updateUsuarioSchema } from "./usuario.schema.js";

const errorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const validationErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  errors: z.array(
    z.object({
      campo: z.string(),
      mensagem: z.string(),
    }),
  ),
});

const usuarioSchema = z.object({
  id: z.number(),
  nome: z.string(),
  cpf: z.string(),
  email: z.string(),
  telefone: z.string().nullable(),
  tipo_usuario: z.string(),
  senha: z.string(),
  status: z.string(),
});

const usuarioResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: usuarioSchema,
});

const usuariosResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(usuarioSchema),
});

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export function registerUsuarioPaths(registry: OpenAPIRegistry) {
  registry.registerPath({
    method: "post",
    path: "/usuarios",
    tags: ["Usuários"],
    summary: "Criar usuário",
    description: "Rota pública usada para cadastro de novos usuários.",
    security: [],
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
        description: "Usuário criado com sucesso",
        content: {
          "application/json": {
            schema: usuarioResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos ou e-mail já cadastrado",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema.or(errorResponseSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/usuarios",
    tags: ["Usuários"],
    summary: "Listar usuários",
    description:
      "Rota protegida. Apenas administradores podem listar usuários.",
    responses: {
      200: {
        description: "Usuários encontrados com sucesso",
        content: {
          "application/json": {
            schema: usuariosResponseSchema,
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão",
        content: {
          "application/json": {
            schema: errorResponseSchema,
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
    description:
      "Rota protegida. Usuários comuns só podem acessar o próprio perfil.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Usuário encontrado com sucesso",
        content: {
          "application/json": {
            schema: usuarioResponseSchema,
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Usuário não encontrado",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Atualizar usuário",
    description:
      "Rota protegida. Usuários comuns só podem atualizar o próprio perfil.",
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
        description: "Usuário atualizado com sucesso",
        content: {
          "application/json": {
            schema: usuarioResponseSchema,
          },
        },
      },
      400: {
        description: "Dados inválidos",
        content: {
          "application/json": {
            schema: validationErrorResponseSchema.or(errorResponseSchema),
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/usuarios/{id}",
    tags: ["Usuários"],
    summary: "Remover usuário",
    description:
      "Rota protegida. Usuários comuns só podem excluir o próprio perfil.",
    request: {
      params: idParamsSchema,
    },
    responses: {
      200: {
        description: "Usuário removido com sucesso",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      401: {
        description: "Token não informado ou inválido",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      403: {
        description: "Usuário sem permissão",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Usuário não encontrado",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });
}
