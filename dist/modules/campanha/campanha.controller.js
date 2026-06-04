"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const campanha_schema_1 = require("./campanha.schema");
// CRIAR CAMPANHA
const create = async (req, res) => {
    const validation = campanha_schema_1.createCampanhaSchema.safeParse(req.body);
    console.log("VALIDAÇÃO:", validation);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    const campanha = await prismaClient_1.default.campanha.create({
        data: validation.data
    });
    return res.status(201).json(campanha);
};
exports.create = create;
// ATUALIZAR CAMPANHA
const update = async (req, res) => {
    const id = Number(req.params.id);
    // validação
    const validation = campanha_schema_1.updateCampanhaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    try {
        const campanha = await prismaClient_1.default.campanha.update({
            where: { id },
            data: validation.data
        });
        return res.status(200).json(campanha);
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                mensagem: "Campanha não encontrada"
            });
        }
        return res.status(500).json({
            mensagem: "Erro interno"
        });
    }
};
exports.update = update;
