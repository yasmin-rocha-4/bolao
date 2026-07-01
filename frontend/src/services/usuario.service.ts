import { api } from "./api";
import type { Usuario } from "../types/usuario";

export const usuarioService = {
  getAll: async () => {
    const response = await api.get("/usuarios");
    return response.data.data as Usuario[];
  },

  create: async (data: Omit<Usuario, "id">) => {
    const response = await api.post("/usuarios", data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Usuario>) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data.data;
  },
};
