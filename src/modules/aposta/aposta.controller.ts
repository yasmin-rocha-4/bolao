import type { Request, Response } from "express";
import { apostaRepository } from "./aposta.repo.js";
import { createApostaSchema, updateApostaSchema } from "./aposta.schema.js";

// CRIAR APOSTA
export const create = async (req: Request, res: Response) => {
  const validation = createApostaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      mensagem: "Dados inválidos",
      erros: validation.error.format(),
    });
  }

  try {
    const data = validation.data;

    const opcao = await apostaRepository.getCampanhaOpcaoById(
      data.campanha_opcao_id,
    );

    if (!opcao) {
      return res.status(404).json({
        mensagem: "Opção da campanha não encontrada",
      });
    }

    const campanha = opcao.campanha;

    if (opcao.status !== "ATIVA") {
      return res.status(400).json({
        mensagem: "Essa opção está inativa",
      });
    }

    if (!campanha.is_publica) {
      return res.status(403).json({
        mensagem: "Esta campanha é privada",
      });
    }

    const now = new Date();

    if (now < campanha.data_inicio) {
      return res.status(400).json({
        mensagem: "Campanha ainda não iniciou",
      });
    }

    if (now > campanha.data_fim) {
      return res.status(400).json({
        mensagem: "Campanha já foi encerrada",
      });
    }

    const aposta = await apostaRepository.create(data);

    return res.status(201).json(aposta);
  } catch (error: any) {
    return res.status(500).json({
      mensagem: "Erro interno",
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
      erros: validation.error.format(),
    });
  }

  try {
    const apostaExistente = await apostaRepository.getById(id);

    if (!apostaExistente) {
      return res.status(404).json({
        mensagem: "Aposta não encontrada",
      });
    }

    const campanha = apostaExistente.campanhaOpcao.campanha;

    const now = new Date();

    if (now > campanha.data_fim) {
      return res.status(400).json({
        mensagem: "Não é possível alterar aposta de uma campanha encerrada",
      });
    }

    const aposta = await apostaRepository.update(id, validation.data);

    return res.status(200).json(aposta);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        mensagem: "Aposta não encontrada",
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno",
    });
  }
};
