"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const usuario_service_js_1 = require("./usuario.service.js");
const getAll = async (req, res) => {
    try {
        const usuarios = await usuario_service_js_1.usuarioService.getAll(req.usuario);
        return res.status(200).json({
            success: true,
            message: "Usuários encontrados com sucesso.",
            data: usuarios,
        });
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const usuario = await usuario_service_js_1.usuarioService.getById(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Usuário encontrado com sucesso.",
            data: usuario,
        });
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    try {
        const usuario = await usuario_service_js_1.usuarioService.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Usuário criado com sucesso.",
            data: usuario,
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
        const usuario = await usuario_service_js_1.usuarioService.update(Number(req.params.id), req.body, req.usuario);
        return res.status(200).json({
            success: true,
            message: "Usuário atualizado com sucesso.",
            data: usuario,
        });
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message,
        });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await usuario_service_js_1.usuarioService.delete(Number(req.params.id), req.usuario);
        return res.status(200).json({
            success: true,
            message: "Usuário removido com sucesso.",
        });
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message,
        });
    }
};
exports.remove = remove;
