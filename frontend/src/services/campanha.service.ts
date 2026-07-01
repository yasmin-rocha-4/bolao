import { api } from "./api";
import type { Campanha, CampanhaForm } from "../types/campanha";

export const campanhaService = {
  getAll: async () => {
    const response = await api.get("/campanhas");
    return response.data.data as Campanha[];
  },

  getById: async (id: number) => {
    const response = await api.get(`/campanhas/${id}`);
    return response.data.data as Campanha;
  },

  create: async (data: CampanhaForm) => {
    const response = await api.post("/campanhas", data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<CampanhaForm>) => {
    const response = await api.put(`/campanhas/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/campanhas/${id}`);
    return response.data.data;
  },
};
