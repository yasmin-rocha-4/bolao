import prisma from "../../prisma/prismaClient";

export const campanhaOpcoesRepository = {
  getAll: () => {
    return prisma.campanhaOpcoes.findMany({
      include: {
        campanha: true,
      },
    });
  },

  getById: (id: number) => {
    return prisma.campanhaOpcoes.findUnique({
      where: { id },
      include: {
        campanha: true,
      },
    });
  },

  create: (data: any) => {
    return prisma.campanhaOpcoes.create({
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

  update: (id: number, data: any) => {
    return prisma.campanhaOpcoes.update({
      where: { id },
      data,
    });
  },

  delete: (id: number) => {
    return prisma.campanhaOpcoes.delete({
      where: { id },
    });
  },
};
