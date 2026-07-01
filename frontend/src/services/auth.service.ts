import { api } from "./api";

export const authService = {
  login: async (data: { email: string; senha: string }) => {
    const response = await api.post("/auth/login", data);

    return response.data.data;
  },
};
