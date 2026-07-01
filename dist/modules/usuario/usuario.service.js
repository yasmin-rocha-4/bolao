"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioService = void 0;
const usuario_repo_js_1 = require("./usuario.repo.js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.usuarioService = {
    getAll: async (usuarioLogado) => {
        if (usuarioLogado.tipo_usuario !== "administrador") {
            throw new Error("Apenas administradores podem listar usuários.");
        }
        return await usuario_repo_js_1.usuarioRepository.getAll();
    },
    getById: async (id, usuarioLogado) => {
        if (usuarioLogado.tipo_usuario !== "administrador" &&
            usuarioLogado.id !== id) {
            throw new Error("Você só pode acessar o seu próprio perfil.");
        }
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        return usuario;
    },
    create: async (data) => {
        const usuarioExistente = await usuario_repo_js_1.usuarioRepository.getByEmail(data.email);
        if (usuarioExistente) {
            throw new Error("E-mail já cadastrado.");
        }
        const senhaCriptografada = await bcryptjs_1.default.hash(data.senha, 10);
        const dadosUsuario = {
            ...data,
            senha: senhaCriptografada,
            tipo_usuario: data.tipo_usuario || "cliente",
            status: "ativo",
        };
        return await usuario_repo_js_1.usuarioRepository.create(dadosUsuario);
    },
    update: async (id, data, usuarioLogado) => {
        if (usuarioLogado.tipo_usuario !== "administrador" &&
            usuarioLogado.id !== id) {
            throw new Error("Você só pode editar o seu próprio perfil.");
        }
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        if (data.email) {
            const usuarioComEmail = await usuario_repo_js_1.usuarioRepository.getByEmail(data.email);
            if (usuarioComEmail && usuarioComEmail.id !== id) {
                throw new Error("E-mail já utilizado por outro usuário.");
            }
        }
        if (data.senha) {
            data.senha = await bcryptjs_1.default.hash(data.senha, 10);
        }
        if (usuarioLogado.tipo_usuario !== "administrador" && data.tipo_usuario) {
            delete data.tipo_usuario;
        }
        return await usuario_repo_js_1.usuarioRepository.update(id, data);
    },
    delete: async (id, usuarioLogado) => {
        if (usuarioLogado.tipo_usuario !== "administrador" &&
            usuarioLogado.id !== id) {
            throw new Error("Você só pode excluir o seu próprio perfil.");
        }
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        return await usuario_repo_js_1.usuarioRepository.delete(id);
    },
};
