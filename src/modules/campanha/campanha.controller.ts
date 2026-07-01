import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { campanhaService } from "./campanha.service.js";

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const campanhas = await campanhaService.getAll(req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Campanhas encontradas com sucesso.",
      data: campanhas,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar campanhas.",
    });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const campanha = await campanhaService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Campanha encontrada com sucesso.",
      data: campanha,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const campanha = await campanhaService.create(req.body, req.usuario!);

    return res.status(201).json({
      success: true,
      message: "Campanha criada com sucesso.",
      data: campanha,
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
    const campanha = await campanhaService.update(
      Number(req.params.id),
      req.body,
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Campanha atualizada com sucesso.",
      data: campanha,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await campanhaService.delete(Number(req.params.id), req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Campanha removida com sucesso.",
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
