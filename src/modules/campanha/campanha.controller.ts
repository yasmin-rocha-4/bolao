import type { Request, Response } from "express";
import { campanhaRepository } from "./campanha.repo.js";
import {
  createCampanhaSchema,
  updateCampanhaSchema,
} from "./campanha.schema.js";

// CRIAR CAMPANHA
export const create = async (req: Request, res: Response) => {
  const validation = createCampanhaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const campanha = await campanhaRepository.create(validation.data);

    return res.status(201).json(campanha);
  } catch (error: any) {
    return res.status(500).json({
      mensagem: "Erro interno",
    });
  }
};

// ATUALIZAR CAMPANHA
export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const validation = updateCampanhaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const campanhaExistente = await campanhaRepository.getById(id);

    if (!campanhaExistente) {
      return res.status(404).json({
        mensagem: "Campanha não encontrada",
      });
    }

    const campanha = await campanhaRepository.update(id, validation.data);

    return res.status(200).json(campanha);
  } catch (error: any) {
    return res.status(500).json({
      mensagem: "Erro interno",
    });
  }
};
