import { api } from "./api";
import type { CampanhaOpcao, CampanhaOpcaoForm } from "../types/campanhaOpcao";

export const campanhaOpcaoService = {
  getAll: async () => {
    const response = await api.get<CampanhaOpcao[]>("/campanha-opcoes");
    return response.data;
  },

  create: async (data: CampanhaOpcaoForm) => {
    const response = await api.post("/campanha-opcoes", data);
    return response.data;
  },

  update: async (id: number, data: Partial<CampanhaOpcaoForm>) => {
    const response = await api.put(`/campanha-opcoes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/campanha-opcoes/${id}`);
    return response.data;
  },
};
