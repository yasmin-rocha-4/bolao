"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaOpcoesService = void 0;
const campanha_opcoes_repo_js_1 = require("./campanha.opcoes.repo.js");
const campanha_repo_js_1 = require("../campanha/campanha.repo.js");
exports.campanhaOpcoesService = {
    getAll: async () => {
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getAll();
    },
    getById: async (id) => {
        const opcao = await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getById(id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        return opcao;
    },
    create: async (data) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(Number(data.campanha_id));
        if (!campanha) {
            throw new Error("Campanha inválida");
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.create(data);
    },
    update: async (id, data) => {
        const opcao = await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getById(id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.update(id, data);
    },
    delete: async (id) => {
        const opcao = await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.getById(id);
        if (!opcao) {
            throw new Error("Opção da campanha não encontrada");
        }
        return await campanha_opcoes_repo_js_1.campanhaOpcoesRepository.delete(id);
    },
};
