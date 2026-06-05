import type { Request, Response } from "express";
import { campanhaService } from "./campanha.service.js";
import {
  createCampanhaSchema,
  updateCampanhaSchema,
} from "./campanha.schema.js";

export const create = async (req: Request, res: Response) => {
  const validation = createCampanhaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const campanha = await campanhaService.create(validation.data);
    return res.status(201).json(campanha);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
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
    );

    return res.status(200).json(campanha);
  } catch (error: any) {
    return res.status(400).json({ mensagem: error.message });
  }
};
