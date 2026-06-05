import type { Request, Response } from "express";
import { usuarioRepository } from "./usuario.repo.js";

import { createUsuarioSchema, updateUsuarioSchema } from "./usuario.schema.js";

// LISTAR TODOS
export const getAll = async (_req: Request, res: Response) => {
  try {
    const usuarios = await usuarioRepository.getAll();

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar usuários",
    });
  }
};

// BUSCAR POR ID
export const getById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar usuário",
    });
  }
};

// CRIAR USUÁRIO
export const create = async (req: Request, res: Response) => {
  const validation = createUsuarioSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const usuario = await usuarioRepository.create(validation.data);

    return res.status(201).json(usuario);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        mensagem: "CPF ou e-mail já cadastrado",
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno",
    });
  }
};

// ATUALIZAR USUÁRIO
export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const validation = updateUsuarioSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const usuarioExistente = await usuarioRepository.getById(id);

    if (!usuarioExistente) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado",
      });
    }

    const usuario = await usuarioRepository.update(id, validation.data);

    return res.status(200).json({
      obj: usuario,
      message: "Usuário atualizado com sucesso",
    });
  } catch (error: any) {
    return res.status(500).json({
      mensagem: "Erro interno",
    });
  }
};

// DELETAR USUÁRIO
export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const usuarioExistente = await usuarioRepository.getById(id);

    if (!usuarioExistente) {
      return res.status(404).json({
        error: "Usuário não encontrado",
      });
    }

    await usuarioRepository.delete(id);

    return res.status(200).json({
      mensagem: "Usuário removido com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno",
    });
  }
};
