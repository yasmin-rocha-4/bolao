"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apostaService = void 0;
const aposta_repo_js_1 = require("./aposta.repo.js");
exports.apostaService = {
    getById: async (id) => {
        const aposta = await aposta_repo_js_1.apostaRepository.getById(id);
        if (!aposta) {
            throw new Error("Aposta não encontrada");
        }
        return aposta;
    },
    create: async (data) => {
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
        return await aposta_repo_js_1.apostaRepository.create(data);
    },
    update: async (id, data) => {
        const apostaExistente = await aposta_repo_js_1.apostaRepository.getById(id);
        if (!apostaExistente) {
            throw new Error("Aposta não encontrada");
        }
        const campanha = apostaExistente.campanhaOpcao.campanha;
        const now = new Date();
        if (now > campanha.data_fim) {
            throw new Error("Não é possível alterar aposta de uma campanha encerrada");
        }
        return await aposta_repo_js_1.apostaRepository.update(id, data);
    },
};
