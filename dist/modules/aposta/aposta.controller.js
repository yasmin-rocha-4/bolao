"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
const aposta_schema_1 = require("./aposta.schema");
// CRIAR APOSTA
const create = async (req, res) => {
    const validation = aposta_schema_1.createApostaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    try {
        const data = validation.data;
        // Buscar opção + campanha
        const opcao = await prismaClient_1.default.campanhaOpcoes.findUnique({
            where: { id: data.campanha_opcao_id },
            include: {
                campanha: true
            }
        });
        if (!opcao) {
            return res.status(404).json({
                mensagem: "Opção da campanha não encontrada"
            });
        }
        const campanha = opcao.campanha;
        // REGRA 1: opção ativa
        if (opcao.status !== "ATIVA") {
            return res.status(400).json({
                mensagem: "Essa opção está inativa"
            });
        }
        // REGRA 2: campanha pública
        if (!campanha.is_publica) {
            return res.status(403).json({
                mensagem: "Esta campanha é privada"
            });
        }
        // REGRA 3: campanha dentro do período
        const now = new Date();
        if (now < campanha.data_inicio) {
            return res.status(400).json({
                mensagem: "Campanha ainda não iniciou"
            });
        }
        if (now > campanha.data_fim) {
            return res.status(400).json({
                mensagem: "Campanha já foi encerrada"
            });
        }
        // CRIAR APOSTA
        const aposta = await prismaClient_1.default.aposta.create({
            data: {
                usuario_id: data.usuario_id,
                campanha_opcao_id: data.campanha_opcao_id,
                meio_pagamento: data.meio_pagamento,
                status: data.status,
                comprovante: data.comprovante
            }
        });
        return res.status(201).json(aposta);
    }
    catch (error) {
        return res.status(500).json({
            mensagem: "Erro interno"
        });
    }
};
exports.create = create;
// ATUALIZAR APOSTA
const update = async (req, res) => {
    const id = Number(req.params.id);
    const validation = aposta_schema_1.updateApostaSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({
            mensagem: "Dados inválidos",
            erros: validation.error.format()
        });
    }
    try {
        const apostaExistente = await prismaClient_1.default.aposta.findUnique({
            where: { id },
            include: {
                campanhaOpcao: {
                    include: {
                        campanha: true
                    }
                }
            }
        });
        if (!apostaExistente) {
            return res.status(404).json({
                mensagem: "Aposta não encontrada"
            });
        }
        const campanha = apostaExistente.campanhaOpcao.campanha;
        // REGRA: não pode alterar aposta de campanha encerrada
        const now = new Date();
        if (now > campanha.data_fim) {
            return res.status(400).json({
                mensagem: "Não é possível alterar aposta de uma campanha encerrada"
            });
        }
        const aposta = await prismaClient_1.default.aposta.update({
            where: { id },
            data: validation.data
        });
        return res.status(200).json(aposta);
    }
    catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                mensagem: "Aposta não encontrada"
            });
        }
        return res.status(500).json({
            mensagem: "Erro interno"
        });
    }
};
exports.update = update;
