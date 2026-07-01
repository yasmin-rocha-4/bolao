import type { Request, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { usuarioService } from "./usuario.service.js";

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const usuarios = await usuarioService.getAll(req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Usuários encontrados com sucesso.",
      data: usuarios,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const usuario = await usuarioService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Usuário encontrado com sucesso.",
      data: usuario,
    });
  } catch (error: any) {
    return res.status(403).json({
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

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const usuario = await usuarioService.update(
      Number(req.params.id),
      req.body,
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Usuário atualizado com sucesso.",
      data: usuario,
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await usuarioService.delete(Number(req.params.id), req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Usuário removido com sucesso.",
    });
  } catch (error: any) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};
