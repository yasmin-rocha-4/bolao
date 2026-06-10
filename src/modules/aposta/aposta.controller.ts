import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { apostaService } from "./aposta.service.js";
import { createApostaSchema, updateApostaSchema } from "./aposta.schema.js";

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const apostas = await apostaService.getAll(req.usuario!);
    return res.status(200).json(apostas);
  } catch {
    return res.status(500).json({ mensagem: "Erro ao buscar apostas" });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const aposta = await apostaService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json(aposta);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};

export const create = async (req: AuthRequest, res: Response) => {
  const validation = createApostaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const aposta = await apostaService.create(validation.data, req.usuario!);
    return res.status(201).json(aposta);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  const validation = updateApostaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const aposta = await apostaService.update(
      Number(req.params.id),
      validation.data,
      req.usuario!,
    );

    return res.status(200).json(aposta);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await apostaService.delete(Number(req.params.id), req.usuario!);

    return res.status(200).json({
      mensagem: "Aposta removida com sucesso",
    });
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};
export const getAllVencedores = async (_req: AuthRequest, res: Response) => {
  try {
    const vencedores = await apostaService.getAllVencedores();
    return res.status(200).json(vencedores);
  } catch {
    return res.status(500).json({ mensagem: "Erro ao buscar vencedores" });
  }
};