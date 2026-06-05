import type { Request, Response } from "express";
import { apostaService } from "./aposta.service.js";
import { createApostaSchema, updateApostaSchema } from "./aposta.schema.js";

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
