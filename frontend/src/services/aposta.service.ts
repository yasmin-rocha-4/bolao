import { api } from "./api";
import type { Aposta, ApostaForm } from "../types/aposta";

export const apostaService = {
  getAll: async () => {
    const response = await api.get<Aposta[]>("/apostas");
    return response.data;
  },

  getAllVencedores: async () => {
    const response = await api.get<Aposta[]>("/apostas/vencedores");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Aposta>(`/apostas/${id}`);
    return response.data;
  },

  create: async (data: ApostaForm) => {
    const response = await api.post("/apostas", data);
    return response.data;
  },

  update: async (id: number, data: Partial<ApostaForm>) => {
    const response = await api.put(`/apostas/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/apostas/${id}`);
    return response.data;
  },
};