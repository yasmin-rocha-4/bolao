"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const usuario_repo_js_1 = require("./usuario.repo.js");
const usuario_schema_js_1 = require("./usuario.schema.js");
// LISTAR TODOS
const getAll = async (_req, res) => {
    try {
        const usuarios = await usuario_repo_js_1.usuarioRepository.getAll();
        return res.status(200).json(usuarios);
    }
    catch (error) {
        return res.status(500).json({
            error: "Erro ao buscar usuários",
        });
    }
};
exports.getAll = getAll;
// BUSCAR POR ID
const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const usuario = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuario) {
            return res.status(404).json({
                error: "Usuário não encontrado",
            });
        }
        return res.status(200).json(usuario);
    }
    catch (error) {
        return res.status(500).json({
            error: "Erro ao buscar usuário",
        });
    }
};
exports.getById = getById;
// CRIAR USUÁRIO
const create = async (req, res) => {
    const validation = usuario_schema_js_1.createUsuarioSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const usuario = await usuario_repo_js_1.usuarioRepository.create(validation.data);
        return res.status(201).json(usuario);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                mensagem: "CPF ou e-mail já cadastrado",
            });
        }
        return res.status(500).json({
            mensagem: "Erro interno",
        });
    }
};
exports.create = create;
// ATUALIZAR USUÁRIO
const update = async (req, res) => {
    const id = Number(req.params.id);
    const validation = usuario_schema_js_1.updateUsuarioSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format(),
        });
    }
    try {
        const usuarioExistente = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuarioExistente) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado",
            });
        }
        const usuario = await usuario_repo_js_1.usuarioRepository.update(id, validation.data);
        return res.status(200).json({
            obj: usuario,
            message: "Usuário atualizado com sucesso",
        });
    }
    catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno",
        });
    }
};
exports.update = update;
// DELETAR USUÁRIO
const remove = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const usuarioExistente = await usuario_repo_js_1.usuarioRepository.getById(id);
        if (!usuarioExistente) {
            return res.status(404).json({
                error: "Usuário não encontrado",
            });
        }
        await usuario_repo_js_1.usuarioRepository.delete(id);
        return res.status(200).json({
            mensagem: "Usuário removido com sucesso",
        });
    }
    catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno",
        });
    }
};
exports.remove = remove;
