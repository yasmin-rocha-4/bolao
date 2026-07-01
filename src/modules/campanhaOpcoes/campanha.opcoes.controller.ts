import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { campanhaOpcoesService } from "./campanha.opcoes.service.js";

export const findAll = async (req: AuthRequest, res: Response) => {
  try {
    const opcoes = await campanhaOpcoesService.getAll(req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Opções encontradas com sucesso.",
      data: opcoes,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar opções da campanha.",
    });
  }
};

export const findById = async (req: AuthRequest, res: Response) => {
  try {
    const opcao = await campanhaOpcoesService.getById(
      Number(req.params.id),
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Opção encontrada com sucesso.",
      data: opcao,
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
    const opcao = await campanhaOpcoesService.create(req.body, req.usuario!);

    return res.status(201).json({
      success: true,
      message: "Opção criada com sucesso.",
      data: opcao,
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
    const opcao = await campanhaOpcoesService.update(
      Number(req.params.id),
      req.body,
      req.usuario!,
    );

    return res.status(200).json({
      success: true,
      message: "Opção atualizada com sucesso.",
      data: opcao,
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
    await campanhaOpcoesService.delete(Number(req.params.id), req.usuario!);

    return res.status(200).json({
      success: true,
      message: "Opção removida com sucesso.",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Opção da campanha não encontrada.",
      });
    }

    if (error.code === "P2003") {
      return res.status(409).json({
        success: false,
        message:
          "Não é possível excluir esta opção porque existem apostas vinculadas a ela.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Erro ao remover opção da campanha.",
    });
  }
};
