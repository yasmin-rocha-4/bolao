import prisma from "../../prisma/prismaClient";

export const campanhaRepository = {
  getAllByCriador: (criadorId: number) => {
    return prisma.campanha.findMany({
      where: {
        criador_id: criadorId,
      },
      include: {
        opcoes: true,
      },
    });
  },

  getAllPublicas: () => {
    return prisma.campanha.findMany({
      where: {
        is_publica: true,
        status: "ATIVA",
      },
      include: {
        opcoes: true,
      },
    });
  },

  getById: (id: number) => {
    return prisma.campanha.findUnique({
      where: { id },
      include: {
        opcoes: true,
      },
    });
  },

  create: (data: any) => {
    return prisma.campanha.create({ data });
  },

  update: (id: number, data: any) => {
    return prisma.campanha.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return prisma.campanha.delete({
      where: { id },
    });
  },
  atualizarCampanhasExpiradas: () => {
    return prisma.campanha.updateMany({
      where: {
        data_fim: {
          lt: new Date(),
        },
        status: "ATIVA",
      },
      data: {
        status: "INATIVA",
      },
    });
  },
};
