"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioService = void 0;
const usuario_repo_js_1 = require("./usuario.repo.js");
exports.usuarioService = {
    getAll: async () => {
        return await usuario_repo_js_1.usuarioRepository.getAll();
    },
    getById: async (id) => {
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        return usuario;
    },
    create: async (data) => {
        const usuarioExistente = await usuario_repo_js_1.usuarioRepository.getByEmail(data.email);
        if (usuarioExistente) {
            throw new Error("E-mail já cadastrado");
        }
        const dadosUsuario = {
            ...data,
            tipo_usuario: "cliente",
            status: "ativo",
        };
        return await usuario_repo_js_1.usuarioRepository.create(dadosUsuario);
    },
    update: async (id, data) => {
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        if (data.email) {
            const usuarioComEmail = await usuario_repo_js_1.usuarioRepository.getByEmail(data.email);
            if (usuarioComEmail && usuarioComEmail.id !== id) {
                throw new Error("E-mail já utilizado por outro usuário");
            }
        }
        return await usuario_repo_js_1.usuarioRepository.update(id, data);
    },
    delete: async (id) => {
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        return await usuario_repo_js_1.usuarioRepository.delete(id);
    },
};
