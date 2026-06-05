import type { Request, Response } from "express";
import { campanhaOpcoesService } from "./campanha.opcoes.service.js";

import {
  createCampanhaOpcoesSchema,
  updateCampanhaOpcoesSchema,
} from "./campanha.opcoes.schema.js";

export const create = async (req: Request, res: Response) => {
  const validation = createCampanhaOpcoesSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const opcao = await campanhaOpcoesService.create(validation.data);
    return res.status(201).json(opcao);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  const validation = updateCampanhaOpcoesSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const opcao = await campanhaOpcoesService.update(
      Number(req.params.id),
      validation.data,
    );

    return res.status(200).json(opcao);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const findAll = async (_req: Request, res: Response) => {
  try {
    const opcoes = await campanhaOpcoesService.getAll();
    return res.status(200).json(opcoes);
  } catch {
    return res.status(500).json({ mensagem: "Erro interno" });
  }
};

export const findById = async (req: Request, res: Response) => {
  try {
    const opcao = await campanhaOpcoesService.getById(Number(req.params.id));
    return res.status(200).json(opcao);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await campanhaOpcoesService.delete(Number(req.params.id));

    return res.status(200).json({
      mensagem: "Opção removida com sucesso",
    });
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};
