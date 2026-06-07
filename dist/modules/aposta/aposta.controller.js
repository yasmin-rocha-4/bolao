"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const aposta_service_js_1 = require("./aposta.service.js");
const aposta_schema_js_1 = require("./aposta.schema.js");
const getAll = async (_req, res) => {
    try {
        const apostas = await aposta_service_js_1.apostaService.getAll();
        return res.status(200).json(apostas);
    }
    catch {
        return res.status(500).json({ mensagem: "Erro ao buscar apostas" });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const aposta = await aposta_service_js_1.apostaService.getById(Number(req.params.id));
        return res.status(200).json(aposta);
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    const validation = aposta_schema_js_1.createApostaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const aposta = await aposta_service_js_1.apostaService.create(validation.data);
        return res.status(201).json(aposta);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const validation = aposta_schema_js_1.updateApostaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const aposta = await aposta_service_js_1.apostaService.update(Number(req.params.id), validation.data);
        return res.status(200).json(aposta);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await aposta_service_js_1.apostaService.delete(Number(req.params.id));
        return res.status(200).json({
            mensagem: "Aposta removida com sucesso",
        });
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.remove = remove;
