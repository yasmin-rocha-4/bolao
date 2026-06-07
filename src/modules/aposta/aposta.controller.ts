import type { Request, Response } from "express";
import { apostaService } from "./aposta.service.js";
import { createApostaSchema, updateApostaSchema } from "./aposta.schema.js";

export const getAll = async (_req: Request, res: Response) => {
  try {
    const apostas = await apostaService.getAll();
    return res.status(200).json(apostas);
  } catch {
    return res.status(500).json({ mensagem: "Erro ao buscar apostas" });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const aposta = await apostaService.getById(Number(req.params.id));
    return res.status(200).json(aposta);
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};

export const create = async (req: Request, res: Response) => {
  const validation = createApostaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const aposta = await apostaService.create(validation.data);
    return res.status(201).json(aposta);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
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
    );

    return res.status(200).json(aposta);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await apostaService.delete(Number(req.params.id));

    return res.status(200).json({
      mensagem: "Aposta removida com sucesso",
    });
  } catch (error: any) {
    return res.status(404).json({ mensagem: error.message });
  }
};
