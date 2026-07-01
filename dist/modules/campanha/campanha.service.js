"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaService = void 0;
const campanha_repo_js_1 = require("./campanha.repo.js");
exports.campanhaService = {
    getAll: async (usuario) => {
        await campanha_repo_js_1.campanhaRepository.atualizarCampanhasExpiradas();
        if (usuario.tipo_usuario === "administrador") {
            return await campanha_repo_js_1.campanhaRepository.getAllByCriador(usuario.id);
        }
        return await campanha_repo_js_1.campanhaRepository.getAllPublicas();
    },
    getById: async (id, usuario) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        if (usuario.tipo_usuario === "administrador" &&
            campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para acessar esta campanha");
        }
        if (usuario.tipo_usuario === "cliente" &&
            (!campanha.is_publica || campanha.status !== "ATIVA")) {
            throw new Error("Campanha não disponível");
        }
        return campanha;
    },
    create: async (data, usuario) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataInicio = new Date(data.data_inicio);
        dataInicio.setHours(0, 0, 0, 0);
        if (usuario.tipo_usuario !== "administrador") {
            throw new Error("Apenas administradores podem criar campanhas");
        }
        if (data.data_inicio >= data.data_fim) {
            throw new Error("A data de início deve ser anterior à data de fim");
        }
        if (dataInicio < hoje) {
            throw new Error("A data de início não pode ser anterior à data de hoje.");
        }
        return await campanha_repo_js_1.campanhaRepository.create({
            ...data,
            criador_id: usuario.id,
        });
    },
    update: async (id, data, usuario) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        if (usuario.tipo_usuario !== "administrador" ||
            campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para editar esta campanha");
        }
        if (data.status === "ENCERRADA" || data.status === "INATIVA") {
            const pendentes = await campanha_repo_js_1.campanhaRepository.temApostasPendentes(id);
            if (pendentes > 0) {
                throw new Error("Não é possível encerrar ou inativar a campanha enquanto houver pagamentos pendentes.");
            }
        }
        return await campanha_repo_js_1.campanhaRepository.update(id, data);
    },
    delete: async (id, usuario) => {
        const campanha = await campanha_repo_js_1.campanhaRepository.getById(id);
        if (!campanha) {
            throw new Error("Campanha não encontrada");
        }
        if (usuario.tipo_usuario !== "administrador" ||
            campanha.criador_id !== usuario.id) {
            throw new Error("Você não tem permissão para excluir esta campanha");
        }
        return await campanha_repo_js_1.campanhaRepository.delete(id);
    },
};
