"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const usuario_schema_1 = require("./usuario.schema");
// LISTAR TODOS
const getAll = async (req, res) => {
    const usuarios = await prismaClient_1.default.usuario.findMany();
    res.json(usuarios);
};
exports.getAll = getAll;
// BUSCAR POR ID
const getById = async (req, res) => {
    const id = Number(req.params.id);
    const usuario = await prismaClient_1.default.usuario.findUnique({
        where: { id },
    });
    if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(usuario);
};
exports.getById = getById;
// CRIAR USUÁRIO
const create = async (req, res) => {
    console.log("🚨 ENTROU NO CREATE");
    const validation = usuario_schema_1.createUsuarioSchema.safeParse(req.body);
    console.log("VALIDAÇÃO:", validation);
    if (!validation.success) {
        console.log("❌ BLOQUEOU NO ZOD");
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    console.log("✅ PASSOU NO ZOD");
    const usuario = await prismaClient_1.default.usuario.create({
        data: validation.data
    });
    return res.status(201).json(usuario);
};
exports.create = create;
// ATUALIZAR USUÁRIO
const update = async (req, res) => {
    const { id } = req.params;
    const updatedUsuario = await prismaClient_1.default.usuario.update({
        where: { id: Number(id) },
        data: req.body
    });
    // Lógica para atualizar um usuário
    return res.status(200).json({ obj: updatedUsuario, message: "Usuário atualizado com sucesso" });
};
exports.update = update;
// DELETAR USUÁRIO
const remove = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prismaClient_1.default.usuario.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }
};
exports.remove = remove;
