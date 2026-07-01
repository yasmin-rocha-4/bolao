"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVencedores = exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const aposta_service_js_1 = require("./aposta.service.js");
const getAll = async (req, res) => {
    try {
        const apostas = await aposta_service_js_1.apostaService.getAll(req.usuario);
        return res.status(200).json({
            success: true,
            message: "Apostas encontradas com sucesso.",
            data: apostas,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar apostas.",
        });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const aposta = await aposta_service_js_1.apostaService.getById(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Aposta encontrada com sucesso.",
            data: aposta,
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
        const aposta = await aposta_service_js_1.apostaService.create(req.body, req.usuario);
        return res.status(201).json({
            success: true,
            message: "Aposta criada com sucesso.",
            data: aposta,
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
        const aposta = await aposta_service_js_1.apostaService.update(Number(req.params.id), req.body, req.usuario);
        return res.status(200).json({
            success: true,
            message: "Aposta atualizada com sucesso.",
            data: aposta,
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
        await aposta_service_js_1.apostaService.delete(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Aposta removida com sucesso.",
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
const getAllVencedores = async (_req, res) => {
    try {
        const vencedores = await aposta_service_js_1.apostaService.getAllVencedores();
        return res.status(200).json({
            success: true,
            message: "Vencedores encontrados com sucesso.",
            data: vencedores,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Erro ao buscar vencedores.",
        });
    }
};
exports.getAllVencedores = getAllVencedores;
