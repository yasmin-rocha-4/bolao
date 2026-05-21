import type { Request, Response } from "express";
import prisma from "../../prisma/prismaClient";

import {
  createApostaSchema,
  updateApostaSchema
} from "./aposta.schema";

// CRIAR APOSTA
export const create = async (req: Request, res: Response) => {
  const validation = createApostaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }

  try {
    const data = validation.data;

    // Buscar opção + campanha
    const opcao = await prisma.campanhaOpcoes.findUnique({
      where: { id: data.campanha_opcao_id },
      include: {
        campanha: true
      }
    });

    if (!opcao) {
      return res.status(404).json({
        mensagem: "Opção da campanha não encontrada"
      });
    }

    const campanha = opcao.campanha;

    // REGRA 1: opção ativa
    if (opcao.status !== "ATIVA") {
      return res.status(400).json({
        mensagem: "Essa opção está inativa"
      });
    }

    // REGRA 2: campanha pública
    if (!campanha.is_publica) {
      return res.status(403).json({
        mensagem: "Esta campanha é privada"
      });
    }

    // REGRA 3: campanha dentro do período
    const now = new Date();

    if (now < campanha.data_inicio) {
      return res.status(400).json({
        mensagem: "Campanha ainda não iniciou"
      });
    }

    if (now > campanha.data_fim) {
      return res.status(400).json({
        mensagem: "Campanha já foi encerrada"
      });
    }

    // CRIAR APOSTA
    const aposta = await prisma.aposta.create({
      data: {
        usuario_id: data.usuario_id,
        campanha_opcao_id: data.campanha_opcao_id,
        meio_pagamento: data.meio_pagamento,
        status: data.status,
        comprovante: data.comprovante
      }
    });

    return res.status(201).json(aposta);

  } catch (error: any) {
    return res.status(500).json({
      mensagem: "Erro interno"
    });
  }
};

// ATUALIZAR APOSTA
export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const validation = updateApostaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format()
    });
  }

  try {
    const apostaExistente = await prisma.aposta.findUnique({
      where: { id },
      include: {
        campanhaOpcao: {
          include: {
            campanha: true
          }
        }
      }
    });

    if (!apostaExistente) {
      return res.status(404).json({
        mensagem: "Aposta não encontrada"
      });
    }

    const campanha = apostaExistente.campanhaOpcao.campanha;

    // REGRA: não pode alterar aposta de campanha encerrada
    const now = new Date();

    if (now > campanha.data_fim) {
      return res.status(400).json({
        mensagem: "Não é possível alterar aposta de uma campanha encerrada"
      });
    }

    const aposta = await prisma.aposta.update({
      where: { id },
      data: validation.data
    });

    return res.status(200).json(aposta);

  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        mensagem: "Aposta não encontrada"
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno"
    });
  }
};