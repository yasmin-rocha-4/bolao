import type { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";
import { createCampanhaSchema, updateCampanhaSchema } from "./campanha.schema";
// CRIAR CAMPANHA
export const create = async (req: Request, res: Response) => {


  const validation = createCampanhaSchema.safeParse(req.body);

  console.log("VALIDAÇÃO:", validation);

  if (!validation.success) {

    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }


  const campanha = await prisma.campanha.create({
    data: validation.data
  });

  return res.status(201).json(campanha);
};
// ATUALIZAR CAMPANHA
export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // validação
  const validation = updateCampanhaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }

  try {
    const campanha = await prisma.campanha.update({
      where: { id },
      data: validation.data
    });

    return res.status(200).json(campanha);

  } catch (error: any) {

    if (error.code === "P2025") {
      return res.status(404).json({
        mensagem: "Campanha não encontrada"
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno"
    });
  }
};