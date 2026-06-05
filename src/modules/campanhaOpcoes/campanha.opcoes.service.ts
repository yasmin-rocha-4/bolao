import { campanhaOpcoesRepository } from "./campanha.opcoes.repo.js";
import { campanhaRepository } from "../campanha/campanha.repo.js";

export const campanhaOpcoesService = {
  getAll: async () => {
    return await campanhaOpcoesRepository.getAll();
  },

  getById: async (id: number) => {
    const opcao = await campanhaOpcoesRepository.getById(id);

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    return opcao;
  },

  create: async (data: any) => {
    const campanha = await campanhaRepository.getById(Number(data.campanha_id));

    if (!campanha) {
      throw new Error("Campanha inválida");
    }

    return await campanhaOpcoesRepository.create(data);
  },

  update: async (id: number, data: any) => {
    const opcao = await campanhaOpcoesRepository.getById(id);

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    return await campanhaOpcoesRepository.update(id, data);
  },

  delete: async (id: number) => {
    const opcao = await campanhaOpcoesRepository.getById(id);

    if (!opcao) {
      throw new Error("Opção da campanha não encontrada");
    }

    return await campanhaOpcoesRepository.delete(id);
  },
};
