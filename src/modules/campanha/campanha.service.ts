import { campanhaRepository } from "./campanha.repo.js";

type UsuarioToken = {
  id: number;
  email: string;
  tipo_usuario: string;
};

export const campanhaService = {
  getAll: async (usuario: UsuarioToken) => {
    if (usuario.tipo_usuario === "administrador") {
      return await campanhaRepository.getAllByCriador(usuario.id);
    }

    return await campanhaRepository.getAllPublicas();
  },

  getById: async (id: number, usuario: UsuarioToken) => {
    const campanha = await campanhaRepository.getById(id);

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    if (
      usuario.tipo_usuario === "administrador" &&
      campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para acessar esta campanha");
    }

    if (
      usuario.tipo_usuario === "cliente" &&
      (!campanha.is_publica || campanha.status !== "ATIVA")
    ) {
      throw new Error("Campanha não disponível");
    }

    return campanha;
  },

  create: async (data: any, usuario: UsuarioToken) => {
    if (usuario.tipo_usuario !== "administrador") {
      throw new Error("Apenas administradores podem criar campanhas");
    }

    if (data.data_inicio >= data.data_fim) {
      throw new Error("A data de início deve ser anterior à data de fim");
    }

    return await campanhaRepository.create({
      ...data,
      criador_id: usuario.id,
    });
  },

  update: async (id: number, data: any, usuario: UsuarioToken) => {
    const campanha = await campanhaRepository.getById(id);

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    if (
      usuario.tipo_usuario !== "administrador" ||
      campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para editar esta campanha");
    }

    return await campanhaRepository.update(id, data);
  },

  delete: async (id: number, usuario: UsuarioToken) => {
    const campanha = await campanhaRepository.getById(id);

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    if (
      usuario.tipo_usuario !== "administrador" ||
      campanha.criador_id !== usuario.id
    ) {
      throw new Error("Você não tem permissão para excluir esta campanha");
    }

    return await campanhaRepository.delete(id);
  },
};