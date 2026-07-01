import { api } from "./api";
import type { Aposta, ApostaForm } from "../types/aposta";

export const apostaService = {
  getAll: async () => {
    const response = await api.get("/apostas");
    return response.data.data as Aposta[];
  },

  getAllVencedores: async () => {
    const response = await api.get("/apostas/vencedores");
    return response.data.data as Aposta[];
  },

  getById: async (id: number) => {
    const response = await api.get(`/apostas/${id}`);
    return response.data.data as Aposta;
  },

  create: async (data: ApostaForm) => {
    const response = await api.post("/apostas", data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ApostaForm>) => {
    const response = await api.put(`/apostas/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/apostas/${id}`);
    return response.data.data;
  },
};
