import prisma from "../../prisma/prismaClient";

export const apostaRepository = {
  getAll: () => {
    return prisma.aposta.findMany({
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

  getById: (id: number) => {
    return prisma.aposta.findUnique({
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

  getCampanhaOpcaoById: (id: number) => {
    return prisma.campanhaOpcoes.findUnique({
      where: { id },
      include: {
        campanha: true,
      },
    });
  },

  create: (data: any) => {
    return prisma.aposta.create({
      data: {
        usuario_id: data.usuario_id,
        campanha_opcao_id: data.campanha_opcao_id,
        meio_pagamento: data.meio_pagamento,
        status: data.status,
        comprovante: data.comprovante,
      },
    });
  },

  update: (id: number, data: any) => {
    return prisma.aposta.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return prisma.aposta.delete({
      where: { id },
    });
  },
};
