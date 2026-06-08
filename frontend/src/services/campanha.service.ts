import { api } from "./api";
import type { Campanha, CampanhaForm } from "../types/campanha";

export const campanhaService = {
  getAll: async () => {
    const response = await api.get<Campanha[]>("/campanhas");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Campanha>(`/campanhas/${id}`);
    return response.data;
  },

  create: async (data: CampanhaForm) => {
    const response = await api.post("/campanhas", data);
    return response.data;
  },

  update: async (id: number, data: Partial<CampanhaForm>) => {
    const response = await api.put(`/campanhas/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/campanhas/${id}`);
    return response.data;
  },
};
