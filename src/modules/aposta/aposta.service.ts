import { apostaRepository } from "./aposta.repo.js";

type UsuarioToken = {
  id: number;
  email: string;
  tipo_usuario: string;
};

export const apostaService = {
  getAll: async (usuario: UsuarioToken) => {
    if (usuario.tipo_usuario === "administrador") {
      return await apostaRepository.getAllByAdmin(usuario.id);
    }

    return await apostaRepository.getAllByUsuario(usuario.id);
  },

  getById: async (id: number, usuario: UsuarioToken) => {
    const aposta = await apostaRepository.getById(id);

    if (!aposta) {
      throw new Error("Aposta não encontrada");
    }

    if (
      usuario.tipo_usuario === "cliente" &&
      aposta.usuario_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para acessar esta aposta");
    }

    if (
      usuario.tipo_usuario === "administrador" &&
      aposta.campanhaOpcao.campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para acessar esta aposta");
    }

    return aposta;
  },

  create: async (data: any, usuario: UsuarioToken) => {
    const opcao = await apostaRepository.getCampanhaOpcaoById(
      data.campanha_opcao_id,
    );

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    const campanha = opcao.campanha;

    if (opcao.status !== "ATIVA") {
      throw new Error("Essa opção está inativa");
    }

    if (!campanha.is_publica) {
      throw new Error("Esta campanha é privada");
    }

    const now = new Date();

    if (now < campanha.data_inicio) {
      throw new Error("Campanha ainda não iniciou");
    }

    if (now > campanha.data_fim) {
      throw new Error("Campanha já foi encerrada");
    }
    let statusPagamento = data.status || "PENDENTE";

    if (
      data.meio_pagamento === "CARTAO_CREDITO" ||
      data.meio_pagamento === "CARTAO_DEBITO"
    ) {
      statusPagamento = "PAGO";
    }
    return await apostaRepository.create({
      ...data,
      status: statusPagamento,
      usuario_id: usuario.id,
    });
  },

  update: async (id: number, data: any, usuario: UsuarioToken) => {
    const aposta = await apostaRepository.getById(id);

    if (!aposta) {
      throw new Error("Aposta não encontrada");
    }

    if (
      usuario.tipo_usuario === "cliente" &&
      aposta.usuario_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para alterar esta aposta");
    }

    if (
      usuario.tipo_usuario === "administrador" &&
      aposta.campanhaOpcao.campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para alterar esta aposta");
    }

    return await apostaRepository.update(id, data);
  },

  delete: async (id: number, usuario: UsuarioToken) => {
    const aposta = await apostaRepository.getById(id);

    if (!aposta) {
      throw new Error("Aposta não encontrada");
    }

    if (
      usuario.tipo_usuario === "cliente" &&
      aposta.usuario_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para excluir esta aposta");
    }

    if (
      usuario.tipo_usuario === "administrador" &&
      aposta.campanhaOpcao.campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para excluir esta aposta");
    }

    return await apostaRepository.delete(id);
  },
  getAllVencedores: async () => {
  return await apostaRepository.getAllVencedores();
},
};