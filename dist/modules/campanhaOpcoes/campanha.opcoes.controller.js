"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.findById = exports.findAll = exports.update = exports.create = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const campanha_opcoes_schema_1 = require("./campanha.opcoes.schema");
// CRIAR OPÇÃO DA CAMPANHA
const create = async (req, res) => {
    const validation = campanha_opcoes_schema_1.createCampanhaOpcoesSchema.safeParse(req.body);
    console.log("VALIDAÇÃO:", validation);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    try {
        const campanhaOpcao = await prismaClient_1.default.campanhaOpcoes.create({
            data: {
                descricao: validation.data.descricao,
                status: validation.data.status,
                eh_resultado_final: validation.data.eh_resultado_final ?? false,
                campanha: {
                    connect: {
                        id: Number(validation.data.campanha_id)
                    }
                }
            }
        });
        return res.status(201).json(campanhaOpcao);
    }
    catch (error) {
        // FK inválida
        if (error.code === "P2003") {
            return res.status(400).json({
                mensagem: "Campanha inválida"
            });
        }
        // UNIQUE (campanha_id + descricao)
        if (error.code === "P2002") {
            return res.status(409).json({
                mensagem: "Já existe uma opção com essa descrição nesta campanha"
            });
        }
        return res.status(500).json({
            mensagem: "Erro interno"
        });
    }
};
exports.create = create;
// ATUALIZAR OPÇÃO DA CAMPANHA
const update = async (req, res) => {
    const id = Number(req.params.id);
    const validation = campanha_opcoes_schema_1.updateCampanhaOpcoesSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    try {
        const campanhaOpcao = await prismaClient_1.default.campanhaOpcoes.update({
            where: { id },
            data: validation.data
        });
        return res.status(200).json(campanhaOpcao);
    }
    catch (error) {
        // registro não encontrado
        if (error.code === "P2025") {
            return res.status(404).json({
                mensagem: "Opção da campanha não encontrada"
            });
        }
        // unique constraint
        if (error.code === "P2002") {
            return res.status(409).json({
                mensagem: "Já existe uma opção com essa descrição nesta campanha"
            });
        }
        return res.status(500).json({
            mensagem: "Erro interno"
        });
    }
};
exports.update = update;
// LISTAR TODAS AS OPÇÕES
const findAll = async (_req, res) => {
    const campanhaOpcoes = await prismaClient_1.default.campanhaOpcoes.findMany({
        include: {
            campanha: true
        }
    });
    return res.status(200).json(campanhaOpcoes);
};
exports.findAll = findAll;
// BUSCAR OPÇÃO POR ID
const findById = async (req, res) => {
    const id = Number(req.params.id);
    const campanhaOpcao = await prismaClient_1.default.campanhaOpcoes.findUnique({
        where: { id },
        include: {
            campanha: true
        }
    });
    if (!campanhaOpcao) {
        return res.status(404).json({
            mensagem: "Opção da campanha não encontrada"
        });
    }
    return res.status(200).json(campanhaOpcao);
};
exports.findById = findById;
// DELETAR OPÇÃO
const remove = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prismaClient_1.default.campanhaOpcoes.delete({
            where: { id }
        });
        return res.status(200).json({
            mensagem: "Opção removida com sucesso"
        });
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                mensagem: "Opção da campanha não encontrada"
            });
        }
        return res.status(500).json({
            mensagem: "Erro interno"
        });
    }
};
exports.remove = remove;
