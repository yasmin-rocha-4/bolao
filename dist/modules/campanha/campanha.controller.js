"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const campanha_service_js_1 = require("./campanha.service.js");
const campanha_schema_js_1 = require("./campanha.schema.js");
const getAll = async (req, res) => {
    try {
        const campanhas = await campanha_service_js_1.campanhaService.getAll(req.usuario);
        return res.status(200).json(campanhas);
    }
    catch {
        return res.status(500).json({ mensagem: "Erro ao buscar campanhas" });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const campanha = await campanha_service_js_1.campanhaService.getById(Number(req.params.id), req.usuario);
        return res.status(200).json(campanha);
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    const validation = campanha_schema_js_1.createCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const campanha = await campanha_service_js_1.campanhaService.create(validation.data, req.usuario);
        return res.status(201).json(campanha);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const validation = campanha_schema_js_1.updateCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const campanha = await campanha_service_js_1.campanhaService.update(Number(req.params.id), validation.data, req.usuario);
        return res.status(200).json(campanha);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await campanha_service_js_1.campanhaService.delete(Number(req.params.id), req.usuario);
        return res.status(200).json({
            mensagem: "Campanha removida com sucesso",
        });
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.remove = remove;
