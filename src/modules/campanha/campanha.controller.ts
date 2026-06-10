import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { campanhaService } from "./campanha.service.js";
import {
  createCampanhaSchema,
  updateCampanhaSchema,
} from "./campanha.schema.js";

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const campanhas = await campanhaService.getAll(req.usuario!);
    return res.status(200).json(campanhas);
  } catch {
    return res.status(500).json({ mensagem: "Erro ao buscar campanhas" });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const campanha = await campanhaService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json(campanha);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  const validation = createCampanhaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const campanha = await campanhaService.create(
      validation.data,
      req.usuario!,
    );

    return res.status(201).json(campanha);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  const validation = updateCampanhaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const campanha = await campanhaService.update(
      Number(req.params.id),
      validation.data,
      req.usuario!,
    );

    return res.status(200).json(campanha);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await campanhaService.delete(Number(req.params.id), req.usuario!);

    return res.status(200).json({
      mensagem: "Campanha removida com sucesso",
    });
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};