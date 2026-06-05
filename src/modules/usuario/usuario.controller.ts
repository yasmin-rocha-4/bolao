import type { Request, Response } from "express";
import { usuarioService } from "./usuario.service.js";
import { createUsuarioSchema, updateUsuarioSchema } from "./usuario.schema.js";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.getAll();
    return res.status(200).json(usuarios);
  } catch {
    return res.status(500).json({ mensagem: "Erro ao buscar usuários" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.getById(Number(req.params.id));
    return res.status(200).json(usuario);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  const validation = createUsuarioSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const usuario = await usuarioService.create(validation.data);
    return res.status(201).json(usuario);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const validation = updateUsuarioSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const usuario = await usuarioService.update(
      Number(req.params.id),
      validation.data,
    );

    return res.status(200).json({
      obj: usuario,
      message: "Usuário atualizado com sucesso",
    });
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await usuarioService.delete(Number(req.params.id));

    return res.status(200).json({
      mensagem: "Usuário removido com sucesso",
    });
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};
