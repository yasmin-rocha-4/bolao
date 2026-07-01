import type { Request, Response } from "express";
import { usuarioService } from "./usuario.service.js";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.getAll();

    return res.status(200).json({
      success: true,
      message: "Usuários encontrados com sucesso.",
      data: usuarios,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar usuários.",
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.getById(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Usuário encontrado com sucesso.",
      data: usuario,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso.",
      data: usuario,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.update(
      Number(req.params.id),
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso.",
      data: usuario,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await usuarioService.delete(Number(req.params.id));

    return res.status(200).json({
      success: true,
      message: "Usuário removido com sucesso.",
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
