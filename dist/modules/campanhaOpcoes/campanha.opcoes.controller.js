"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.findById = exports.findAll = exports.update = exports.create = void 0;
const campanha_opcoes_service_js_1 = require("./campanha.opcoes.service.js");
const campanha_opcoes_schema_js_1 = require("./campanha.opcoes.schema.js");
const create = async (req, res) => {
    const validation = campanha_opcoes_schema_js_1.createCampanhaOpcoesSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const opcao = await campanha_opcoes_service_js_1.campanhaOpcoesService.create(validation.data, req.usuario);
        return res.status(201).json(opcao);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const validation = campanha_opcoes_schema_js_1.updateCampanhaOpcoesSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const opcao = await campanha_opcoes_service_js_1.campanhaOpcoesService.update(Number(req.params.id), validation.data, req.usuario);
        return res.status(200).json(opcao);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.update = update;
const findAll = async (req, res) => {
    try {
        const opcoes = await campanha_opcoes_service_js_1.campanhaOpcoesService.getAll(req.usuario);
        return res.status(200).json(opcoes);
    }
    catch {
        return res.status(500).json({
            mensagem: "Erro ao buscar opções da campanha",
        });
    }
};
exports.findAll = findAll;
const findById = async (req, res) => {
    try {
        const opcao = await campanha_opcoes_service_js_1.campanhaOpcoesService.getById(Number(req.params.id), req.usuario);
        return res.status(200).json(opcao);
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.findById = findById;
const remove = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await campanha_opcoes_service_js_1.campanhaOpcoesService.delete(id, req.usuario);
        return res.status(200).json({
            mensagem: "Opção removida com sucesso",
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                mensagem: "Opção da campanha não encontrada",
            });
        }
        if (error.code === "P2003") {
            return res.status(400).json({
                mensagem: "Não é possível excluir esta opção porque já existem apostas vinculadas a ela.",
            });
        }
        return res.status(400).json({
            mensagem: error.message || "Erro ao remover opção da campanha",
        });
    }
};
exports.remove = remove;
