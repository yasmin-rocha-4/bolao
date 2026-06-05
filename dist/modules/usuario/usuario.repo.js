"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioRepository = void 0;
const prismaClient_1 = __importDefault(require("../../prisma/prismaClient"));
exports.usuarioRepository = {
    getAll: () => {
        return prismaClient_1.default.usuario.findMany();
    },
    getById: (id) => {
        return prismaClient_1.default.usuario.findUnique({
            where: { id },
        });
    },
    getByEmail: (email) => {
        return prismaClient_1.default.usuario.findUnique({
            where: { email },
        });
    },
    create: (data) => {
        return prismaClient_1.default.usuario.create({ data });
    },
    update: (id, data) => {
        return prismaClient_1.default.usuario.update({
            where: { id },
            data,
        });
    },
    delete: (id) => {
        return prismaClient_1.default.usuario.delete({
            where: { id },
        });
    },
};
