import { usuarioRepository } from "./usuario.repo.js";
import bcrypt from "bcryptjs";

type UsuarioToken = {
  id: number;
  email: string;
  tipo_usuario: string;
};

export const usuarioService = {
  getAll: async (usuarioLogado: UsuarioToken) => {
    if (usuarioLogado.tipo_usuario !== "administrador") {
      throw new Error("Apenas administradores podem listar usuários.");
    }

    return await usuarioRepository.getAll();
  },

  getById: async (id: number, usuarioLogado: UsuarioToken) => {
    if (
      usuarioLogado.tipo_usuario !== "administrador" &&
      usuarioLogado.id !== id
    ) {
      throw new Error("Você só pode acessar o seu próprio perfil.");
    }

    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    return usuario;
  },

  create: async (data: any) => {
    const usuarioExistente = await usuarioRepository.getByEmail(data.email);

    if (usuarioExistente) {
      throw new Error("E-mail já cadastrado.");
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

  update: async (id: number, data: any, usuarioLogado: UsuarioToken) => {
    if (
      usuarioLogado.tipo_usuario !== "administrador" &&
      usuarioLogado.id !== id
    ) {
      throw new Error("Você só pode editar o seu próprio perfil.");
    }

    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    if (data.email) {
      const usuarioComEmail = await usuarioRepository.getByEmail(data.email);

      if (usuarioComEmail && usuarioComEmail.id !== id) {
        throw new Error("E-mail já utilizado por outro usuário.");
      }
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    if (usuarioLogado.tipo_usuario !== "administrador" && data.tipo_usuario) {
      delete data.tipo_usuario;
    }

    return await usuarioRepository.update(id, data);
  },

  delete: async (id: number, usuarioLogado: UsuarioToken) => {
    if (
      usuarioLogado.tipo_usuario !== "administrador" &&
      usuarioLogado.id !== id
    ) {
      throw new Error("Você só pode excluir o seu próprio perfil.");
    }

    const usuario = await usuarioRepository.getById(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    return await usuarioRepository.delete(id);
  },
};
