"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuario_repo_1 = require("../usuario/usuario.repo");
exports.authService = {
    login: async (email, senha) => {
        const usuario = await usuario_repo_1.usuarioRepository.getByEmail(email);
        if (!usuario) {
            throw new Error("E-mail ou senha inválidos");
        }
        const senhaValida = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error("E-mail ou senha inválidos");
        }
        if (usuario.status !== "ativo") {
            throw new Error("Usuário inativo");
        }
        const token = jsonwebtoken_1.default.sign({
            id: usuario.id,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario,
        }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
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
