import { campanhaOpcoesRepository } from "./campanha.opcoes.repo.js";
import { campanhaRepository } from "../campanha/campanha.repo.js";

type UsuarioToken = {
  id: number;
  email: string;
  tipo_usuario: string;
};

export const campanhaOpcoesService = {
  getAll: async (usuario: UsuarioToken) => {
    if (usuario.tipo_usuario === "administrador") {
      return await campanhaOpcoesRepository.getAllByAdmin(usuario.id);
    }

    return await campanhaOpcoesRepository.getAllPublicas();
  },

  getById: async (id: number, usuario: UsuarioToken) => {
    const opcao = await campanhaOpcoesRepository.getById(id);

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    if (
      usuario.tipo_usuario === "administrador" &&
      opcao.campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para acessar esta opção");
    }

    if (
      usuario.tipo_usuario === "cliente" &&
      (!opcao.campanha.is_publica ||
        opcao.campanha.status !== "ATIVA" ||
        opcao.status !== "ATIVA")
    ) {
      throw new Error("Opção não disponível");
    }

    return opcao;
  },

  create: async (data: any, usuario: UsuarioToken) => {
    if (usuario.tipo_usuario !== "administrador") {
      throw new Error("Apenas administradores podem criar opções");
    }

    const campanha = await campanhaRepository.getById(Number(data.campanha_id));

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    if (campanha.criador_id !== usuario.id) {
      throw new Error(
        "Você não tem permissão para criar opção nesta campanha",
      );
    }

    return await campanhaOpcoesRepository.create(data);
  },

  update: async (id: number, data: any, usuario: UsuarioToken) => {
    const opcao = await campanhaOpcoesRepository.getById(id);

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    if (
      usuario.tipo_usuario !== "administrador" ||
      opcao.campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para alterar esta opção");
    }

    return await campanhaOpcoesRepository.update(id, data);
  },

  delete: async (id: number, usuario: UsuarioToken) => {
    const opcao = await campanhaOpcoesRepository.getById(id);

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    if (
      usuario.tipo_usuario !== "administrador" ||
      opcao.campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para excluir esta opção");
    }

    return await campanhaOpcoesRepository.delete(id);
  },
};