import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { apostaService } from "./aposta.service.js";

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const apostas = await apostaService.getAll(req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Apostas encontradas com sucesso.",
      data: apostas,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar apostas.",
    });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const aposta = await apostaService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Aposta encontrada com sucesso.",
      data: aposta,
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
    const aposta = await apostaService.create(req.body, req.usuario!);

    return res.status(201).json({
      success: true,
      message: "Aposta criada com sucesso.",
      data: aposta,
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
    const aposta = await apostaService.update(
      Number(req.params.id),
      req.body,
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Aposta atualizada com sucesso.",
      data: aposta,
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
    await apostaService.delete(Number(req.params.id), req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Aposta removida com sucesso.",
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllVencedores = async (_req: AuthRequest, res: Response) => {
  try {
    const vencedores = await apostaService.getAllVencedores();

    return res.status(200).json({
      success: true,
      message: "Vencedores encontrados com sucesso.",
      data: vencedores,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar vencedores.",
    });
  }
};
