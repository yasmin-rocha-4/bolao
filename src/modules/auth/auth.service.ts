import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { usuarioRepository } from "../usuario/usuario.repo";

export const authService = {
  login: async (email: string, senha: string) => {
    const usuario = await usuarioRepository.getByEmail(email);

    if (!usuario) {
      throw new Error("E-mail ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("E-mail ou senha inválidos");
    }

    if (usuario.status !== "ativo") {
      throw new Error("Usuário inativo");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    };
  },
};