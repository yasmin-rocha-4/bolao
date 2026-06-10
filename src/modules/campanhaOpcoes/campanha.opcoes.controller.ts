import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";

import { campanhaOpcoesService } from "./campanha.opcoes.service.js";

import {
  createCampanhaOpcoesSchema,
  updateCampanhaOpcoesSchema,
} from "./campanha.opcoes.schema.js";

export const create = async (req: AuthRequest, res: Response) => {
  const validation = createCampanhaOpcoesSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const opcao = await campanhaOpcoesService.create(
      validation.data,
      req.usuario!,
    );

    return res.status(201).json(opcao);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
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
      req.usuario!,
    );

    return res.status(200).json(opcao);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const findAll = async (req: AuthRequest, res: Response) => {
  try {
    const opcoes = await campanhaOpcoesService.getAll(req.usuario!);

    return res.status(200).json(opcoes);
  } catch {
    return res.status(500).json({
      mensagem: "Erro ao buscar opções da campanha",
    });
  }
};

export const findById = async (req: AuthRequest, res: Response) => {
  try {
    const opcao = await campanhaOpcoesService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json(opcao);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);

  try {
    await campanhaOpcoesService.delete(id, req.usuario!);

    return res.status(200).json({
      mensagem: "Opção removida com sucesso",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        mensagem: "Opção da campanha não encontrada",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        mensagem:
          "Não é possível excluir esta opção porque já existem apostas vinculadas a ela.",
      });
    }

    return res.status(400).json({
      mensagem: error.message || "Erro ao remover opção da campanha",
    });
  }
};