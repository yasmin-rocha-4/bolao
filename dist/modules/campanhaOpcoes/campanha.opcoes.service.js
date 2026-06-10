"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaOpcoesService = void 0;
const campanha_opcoes_repo_js_1 = require("./campanha.opcoes.repo.js");
const campanha_repo_js_1 = require("../campanha/campanha.repo.js");
exports.campanhaOpcoesService = {
    getAll: async (usuario) => {
        if (usuario.tipo_usuario === "administrador") {
            return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getAllByAdmin(usuario.id);
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getAllPublicas();
    },
    getById: async (id, usuario) => {
        const opcao = await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getById(id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        if (usuario.tipo_usuario === "administrador" &&
            opcao.campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para acessar esta opção");
        }
        if (usuario.tipo_usuario === "cliente" &&
            (!opcao.campanha.is_publica ||
                opcao.campanha.status !== "ATIVA" ||
                opcao.status !== "ATIVA")) {
            throw new Error("Opção não disponível");
        }
        return opcao;
    },
    create: async (data, usuario) => {
        if (usuario.tipo_usuario !== "administrador") {
            throw new Error("Apenas administradores podem criar opções");
        }
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(Number(data.campanha_id));
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        if (campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para criar opção nesta campanha");
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.create(data);
    },
    update: async (id, data, usuario) => {
        const opcao = await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getById(id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        if (usuario.tipo_usuario !== "administrador" ||
            opcao.campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para alterar esta opção");
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.update(id, data);
    },
    delete: async (id, usuario) => {
        const opcao = await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getById(id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        if (usuario.tipo_usuario !== "administrador" ||
            opcao.campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para excluir esta opção");
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.delete(id);
    },
};
