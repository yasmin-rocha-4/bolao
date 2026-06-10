"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apostaRepository = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
exports.apostaRepository = {
    getAllByUsuario: (usuarioId) => {
        return prismaClient_1.default.aposta.findMany({
            where: {
                usuario_id: usuarioId,
            },
            include: {
                usuario: true,
                campanhaOpcao: {
                    include: {
                        campanha: true,
                    },
                },
            },
        });
    },
    getAllByAdmin: (adminId) => {
        return prismaClient_1.default.aposta.findMany({
            where: {
                campanhaOpcao: {
                    campanha: {
                        criador_id: adminId,
                    },
                },
            },
            include: {
                usuario: true,
                campanhaOpcao: {
                    include: {
                        campanha: true,
                    },
                },
            },
        });
    },
    getById: (id) => {
        return prismaClient_1.default.aposta.findUnique({
            where: { id },
            include: {
                usuario: true,
                campanhaOpcao: {
                    include: {
                        campanha: true,
                    },
                },
            },
        });
    },
    getCampanhaOpcaoById: (id) => {
        return prismaClient_1.default.campanhaOpcoes.findUnique({
            where: { id },
            include: {
                campanha: true,
            },
        });
    },
    getAllVencedores: () => {
        return prismaClient_1.default.aposta.findMany({
            where: {
                campanhaOpcao: {
                    eh_resultado_final: true,
                },
            },
            include: {
                usuario: true,
                campanhaOpcao: {
                    include: {
                        campanha: true,
                    },
                },
            },
        });
    },
    create: (data) => {
        return prismaClient_1.default.aposta.create({
            data: {
                usuario_id: data.usuario_id,
                campanha_opcao_id: data.campanha_opcao_id,
                meio_pagamento: data.meio_pagamento,
                status: data.status,
                comprovante: data.comprovante,
            },
        });
    },
    update: (id, data) => {
        return prismaClient_1.default.aposta.update({
            where: { id },
            data,
        });
    },
    delete: (id) => {
        return prismaClient_1.default.aposta.delete({
            where: { id },
        });
    },
};
