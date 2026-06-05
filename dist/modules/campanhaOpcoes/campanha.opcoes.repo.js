"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaOpcoesRepository = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
exports.campanhaOpcoesRepository = {
    getAll: () => {
        return prismaClient_1.default.campanhaOpcoes.findMany({
            include: {
                campanha: true,
            },
        });
    },
    getById: (id) => {
        return prismaClient_1.default.campanhaOpcoes.findUnique({
            where: { id },
            include: {
                campanha: true,
            },
        });
    },
    create: (data) => {
        return prismaClient_1.default.campanhaOpcoes.create({
            data: {
                descricao: data.descricao,
                status: data.status,
                eh_resultado_final: data.eh_resultado_final ?? false,
                campanha: {
                    connect: {
                        id: Number(data.campanha_id),
                    },
                },
            },
        });
    },
    update: (id, data) => {
        return prismaClient_1.default.campanhaOpcoes.update({
            where: { id },
            data,
        });
    },
    delete: (id) => {
        return prismaClient_1.default.campanhaOpcoes.delete({
            where: { id },
        });
    },
};
