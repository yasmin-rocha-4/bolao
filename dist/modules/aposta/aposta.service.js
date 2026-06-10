"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apostaService = void 0;
const aposta_repo_js_1 = require("./aposta.repo.js");
exports.apostaService = {
    getAll: async (usuario) => {
        if (usuario.tipo_usuario === "administrador") {
            return await aposta_repo_js_1.apostaRepository.getAllByAdmin(usuario.id);
        }
        return await aposta_repo_js_1.apostaRepository.getAllByUsuario(usuario.id);
    },
    getById: async (id, usuario) => {
        const aposta = await aposta_repo_js_1.apostaRepository.getById(id);
        if (!aposta) {
            throw new Error("Aposta não encontrada");
        }
        if (usuario.tipo_usuario === "cliente" &&
            aposta.usuario_id !== usuario.id) {
            throw new Error("Você não tem permissão para acessar esta aposta");
        }
        if (usuario.tipo_usuario === "administrador" &&
            aposta.campanhaOpcao.campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para acessar esta aposta");
        }
        return aposta;
    },
    create: async (data, usuario) => {
        const opcao = await aposta_repo_js_1.apostaRepository.getCampanhaOpcaoById(data.campanha_opcao_id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        const campanha = opcao.campanha;
        if (opcao.status !== "ATIVA") {
            throw new Error("Essa opção está inativa");
        }
        if (!campanha.is_publica) {
            throw new Error("Esta campanha é privada");
        }
        const now = new Date();
        if (now < campanha.data_inicio) {
            throw new Error("Campanha ainda não iniciou");
        }
        if (now > campanha.data_fim) {
            throw new Error("Campanha já foi encerrada");
        }
        return await aposta_repo_js_1.apostaRepository.create({
            ...data,
            usuario_id: usuario.id,
        });
    },
    update: async (id, data, usuario) => {
        const aposta = await aposta_repo_js_1.apostaRepository.getById(id);
        if (!aposta) {
            throw new Error("Aposta não encontrada");
        }
        if (usuario.tipo_usuario === "cliente" &&
            aposta.usuario_id !== usuario.id) {
            throw new Error("Você não tem permissão para alterar esta aposta");
        }
        if (usuario.tipo_usuario === "administrador" &&
            aposta.campanhaOpcao.campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para alterar esta aposta");
        }
        return await aposta_repo_js_1.apostaRepository.update(id, data);
    },
    delete: async (id, usuario) => {
        const aposta = await aposta_repo_js_1.apostaRepository.getById(id);
        if (!aposta) {
            throw new Error("Aposta não encontrada");
        }
        if (usuario.tipo_usuario === "cliente" &&
            aposta.usuario_id !== usuario.id) {
            throw new Error("Você não tem permissão para excluir esta aposta");
        }
        if (usuario.tipo_usuario === "administrador" &&
            aposta.campanhaOpcao.campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para excluir esta aposta");
        }
        return await aposta_repo_js_1.apostaRepository.delete(id);
    },
    getAllVencedores: async () => {
        return await aposta_repo_js_1.apostaRepository.getAllVencedores();
    },
};
