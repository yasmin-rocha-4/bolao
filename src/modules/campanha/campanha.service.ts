import { campanhaRepository } from "./campanha.repo.js";

export const campanhaService = {
  getAll: async () => {
    return await campanhaRepository.getAll();
  },

  getById: async (id: number) => {
    const campanha = await campanhaRepository.getById(id);

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    return campanha;
  },

  create: async (data: any) => {
    if (data.data_inicio >= data.data_fim) {
      throw new Error("A data de início deve ser anterior à data de fim");
    }

    return await campanhaRepository.create(data);
  },

  update: async (id: number, data: any) => {
    const campanha = await campanhaRepository.getById(id);

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    return await campanhaRepository.update(id, data);
  },

  delete: async (id: number) => {
    const campanha = await campanhaRepository.getById(id);

    if (!campanha) {
      throw new Error("Campanha não encontrada");
    }

    return await campanhaRepository.delete(id);
  },
};
