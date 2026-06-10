import { usuarioRepository } from "./usuario.repo.js";
import bcrypt from "bcryptjs";

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

    const senhaCriptografada = await bcrypt.hash(data.senha, 10);

    const dadosUsuario = {
      ...data,
      senha: senhaCriptografada,
      tipo_usuario: data.tipo_usuario || "cliente",
      status: "ativo",
    };

    return await usuarioRepository.create(dadosUsuario);
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

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
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