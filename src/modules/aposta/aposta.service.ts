import { apostaRepository } from "./aposta.repo.js";

export const apostaService = {
  getAll: async () => {
    return await apostaRepository.getAll();
  },

  getById: async (id: number) => {
    const aposta = await apostaRepository.getById(id);

    if (!aposta) {
      throw new Error("Aposta não encontrada");
    }

    return aposta;
  },

  create: async (data: any) => {
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

    return await apostaRepository.create(data);
  },

  update: async (id: number, data: any) => {
    const aposta = await apostaRepository.getById(id);

    if (!aposta) {
      throw new Error("Aposta não encontrada");
    }

    return await apostaRepository.update(id, data);
  },

  delete: async (id: number) => {
    const aposta = await apostaRepository.getById(id);

    if (!aposta) {
      throw new Error("Aposta não encontrada");
    }

    return await apostaRepository.delete(id);
  },
};
