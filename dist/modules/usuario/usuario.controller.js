"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const usuario_service_js_1 = require("./usuario.service.js");
const usuario_schema_js_1 = require("./usuario.schema.js");
const getAll = async (_req, res) => {
    try {
        const usuarios = await usuario_service_js_1.usuarioService.getAll();
        return res.status(200).json(usuarios);
    }
    catch {
        return res.status(500).json({ mensagem: "Erro ao buscar usuários" });
    }
};
exports.getAll = getAll;
const getById = async (req, res) => {
    try {
        const usuario = await usuario_service_js_1.usuarioService.getById(Number(req.params.id));
        return res.status(200).json(usuario);
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.getById = getById;
const create = async (req, res) => {
    const validation = usuario_schema_js_1.createUsuarioSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const usuario = await usuario_service_js_1.usuarioService.create(validation.data);
        return res.status(201).json(usuario);
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    const validation = usuario_schema_js_1.updateUsuarioSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const usuario = await usuario_service_js_1.usuarioService.update(Number(req.params.id), validation.data);
        return res.status(200).json({
            obj: usuario,
            message: "Usuário atualizado com sucesso",
        });
    }
    catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await usuario_service_js_1.usuarioService.delete(Number(req.params.id));
        return res.status(200).json({
            mensagem: "Usuário removido com sucesso",
        });
    }
    catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }
};
exports.remove = remove;
