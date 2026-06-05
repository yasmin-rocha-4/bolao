"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaRepository = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
exports.campanhaRepository = {
    getAll: () => {
        return prismaClient_1.default.campanha.findMany({
            include: {
                opcoes: true,
            },
        });
    },
    getById: (id) => {
        return prismaClient_1.default.campanha.findUnique({
            where: { id },
            include: {
                opcoes: true,
            },
        });
    },
    create: (data) => {
        return prismaClient_1.default.campanha.create({ data });
    },
    update: (id, data) => {
        return prismaClient_1.default.campanha.update({
            where: { id },
            data,
        });
    },
    delete: (id) => {
        return prismaClient_1.default.campanha.delete({
            where: { id },
        });
    },
};
