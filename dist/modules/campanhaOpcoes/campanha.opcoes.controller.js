"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findById = exports.findAll = void 0;
const campanha_opcoes_service_js_1 = require("./campanha.opcoes.service.js");
const findAll = async (req, res) => {
    try {
        const opcoes = await campanha_opcoes_service_js_1.campanhaOpcoesService.getAll(req.usuario);
        return res.status(200).json({
            success: true,
            message: "Opções encontradas com sucesso.",
            data: opcoes,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar opções da campanha.",
        });
    }
};
exports.findAll = findAll;
const findById = async (req, res) => {
    try {
        const opcao = await campanha_opcoes_service_js_1.campanhaOpcoesService.getById(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Opção encontrada com sucesso.",
            data: opcao,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.findById = findById;
const create = async (req, res) => {
    try {
        const opcao = await campanha_opcoes_service_js_1.campanhaOpcoesService.create(req.body, req.usuario);
        return res.status(201).json({
            success: true,
            message: "Opção criada com sucesso.",
            data: opcao,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.create = create;
const update = async (req, res) => {
    try {
        const opcao = await campanha_opcoes_service_js_1.campanhaOpcoesService.update(Number(req.params.id), req.body, req.usuario);
        return res.status(200).json({
            success: true,
            message: "Opção atualizada com sucesso.",
            data: opcao,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await campanha_opcoes_service_js_1.campanhaOpcoesService.delete(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Opção removida com sucesso.",
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Opção da campanha não encontrada.",
            });
        }
        if (error.code === "P2003") {
            return res.status(409).json({
                success: false,
                message: "Não é possível excluir esta opção porque existem apostas vinculadas a ela.",
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message || "Erro ao remover opção da campanha.",
        });
    }
};
exports.remove = remove;
