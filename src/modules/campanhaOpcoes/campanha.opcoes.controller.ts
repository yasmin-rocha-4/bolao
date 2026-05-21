import type { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

import {
  createCampanhaOpcoesSchema,
  updateCampanhaOpcoesSchema
} from "./campanha.opcoes.schema";

// CRIAR OPÇÃO DA CAMPANHA
export const create = async (req: Request, res: Response) => {

  const validation = createCampanhaOpcoesSchema.safeParse(req.body);

  console.log("VALIDAÇÃO:", validation);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }

  try {

    const campanhaOpcao = await prisma.campanhaOpcoes.create({
  data: {
    descricao: validation.data.descricao,
    status: validation.data.status,
    eh_resultado_final: validation.data.eh_resultado_final ?? false,

    campanha: {
      connect: {
        id: Number(validation.data.campanha_id)
      }
    }
  }
});

    return res.status(201).json(campanhaOpcao);

  } catch (error: any) {

    // FK inválida
    if (error.code === "P2003") {
      return res.status(400).json({
        mensagem: "Campanha inválida"
      });
    }

    // UNIQUE (campanha_id + descricao)
    if (error.code === "P2002") {
      return res.status(409).json({
        mensagem: "Já existe uma opção com essa descrição nesta campanha"
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno"
    });
  }
};

// ATUALIZAR OPÇÃO DA CAMPANHA
export const update = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const validation = updateCampanhaOpcoesSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }

  try {

    const campanhaOpcao = await prisma.campanhaOpcoes.update({
      where: { id },
      data: validation.data
    });

    return res.status(200).json(campanhaOpcao);

  } catch (error: any) {

    // registro não encontrado
    if (error.code === "P2025") {
      return res.status(404).json({
        mensagem: "Opção da campanha não encontrada"
      });
    }

    // unique constraint
    if (error.code === "P2002") {
      return res.status(409).json({
        mensagem: "Já existe uma opção com essa descrição nesta campanha"
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno"
    });
  }
};

// LISTAR TODAS AS OPÇÕES
export const findAll = async (_req: Request, res: Response) => {

  const campanhaOpcoes = await prisma.campanhaOpcoes.findMany({
    include: {
      campanha: true
    }
  });

  return res.status(200).json(campanhaOpcoes);
};

// BUSCAR OPÇÃO POR ID
export const findById = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  const campanhaOpcao = await prisma.campanhaOpcoes.findUnique({
    where: { id },
    include: {
      campanha: true
    }
  });

  if (!campanhaOpcao) {
    return res.status(404).json({
      mensagem: "Opção da campanha não encontrada"
    });
  }

  return res.status(200).json(campanhaOpcao);
};

// DELETAR OPÇÃO
export const remove = async (req: Request, res: Response) => {

  const id = Number(req.params.id);

  try {

    await prisma.campanhaOpcoes.delete({
      where: { id }
    });

    return res.status(200).json({
      mensagem: "Opção removida com sucesso"
    });

  } catch (error: any) {

    if (error.code === "P2025") {
      return res.status(404).json({
        mensagem: "Opção da campanha não encontrada"
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno"
    });
  }
};