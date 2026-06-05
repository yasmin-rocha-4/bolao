import { usuarioRepository } from "./usuario.repo.js";

export const usuarioService = {
  getAll: async () => {
    return await usuarioRepository.getAll();
  },

  getById: async (id: number) => {
    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return usuario;
  },

  create: async (data: any) => {
    const usuarioExistente = await usuarioRepository.getByEmail(data.email);

    if (usuarioExistente) {
      throw new Error("E-mail já cadastrado");
    }

    return await usuarioRepository.create(data);
  },

  update: async (id: number, data: any) => {
    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (data.email) {
      const usuarioComEmail = await usuarioRepository.getByEmail(data.email);

      if (usuarioComEmail && usuarioComEmail.id !== id) {
        throw new Error("E-mail já utilizado por outro usuário");
      }
    }

    return await usuarioRepository.update(id, data);
  },

  delete: async (id: number) => {
    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return await usuarioRepository.delete(id);
  },
};
