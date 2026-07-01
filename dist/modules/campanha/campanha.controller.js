"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const campanha_service_js_1 = require("./campanha.service.js");
const getAll = async (req, res) => {
    try {
        const campanhas = await campanha_service_js_1.campanhaService.getAll(req.usuario);
        return res.status(200).json({
            success: true,
            message: "Campanhas encontradas com sucesso.",
            data: campanhas,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar campanhas.",
        });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const campanha = await campanha_service_js_1.campanhaService.getById(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Campanha encontrada com sucesso.",
            data: campanha,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    try {
        const campanha = await campanha_service_js_1.campanhaService.create(req.body, req.usuario);
        return res.status(201).json({
            success: true,
            message: "Campanha criada com sucesso.",
            data: campanha,
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
        const campanha = await campanha_service_js_1.campanhaService.update(Number(req.params.id), req.body, req.usuario);
        return res.status(200).json({
            success: true,
            message: "Campanha atualizada com sucesso.",
            data: campanha,
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
        await campanha_service_js_1.campanhaService.delete(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Campanha removida com sucesso.",
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
exports.remove = remove;
