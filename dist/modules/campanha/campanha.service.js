"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaService = void 0;
const campanha_repo_js_1 = require("./campanha.repo.js");
exports.campanhaService = {
    getAll: async () => {
        return await campanha_repo_js_1.campanhaRepository.getAll();
    },
    getById: async (id) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        return campanha;
    },
    create: async (data) => {
        if (data.data_inicio >= data.data_fim) {
            throw new Error("A data de início deve ser anterior à data de fim");
        }
        return await campanha_repo_js_1.campanhaRepository.create(data);
    },
    update: async (id, data) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        return await campanha_repo_js_1.campanhaRepository.update(id, data);
    },
    delete: async (id) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        return await campanha_repo_js_1.campanhaRepository.delete(id);
    },
};
